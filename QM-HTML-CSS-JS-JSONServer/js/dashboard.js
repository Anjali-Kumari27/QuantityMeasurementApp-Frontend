// Check login
const loggedInUser = localStorage.getItem("user");
if (!loggedInUser) {
  window.location.href = "login.html";
}

// JSON Server base URL
const BASE_URL = "http://localhost:3000";

// Current selected measurement type
let currentType = "length";

// Current selected operation
let currentOperation = "convert";

// Units for each type
const unitsData = {
  length: ["Metres", "Centimetres", "Kilometres"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  volume: ["Litres", "Millilitres", "Gallons"],
  weight: ["Kilograms", "Grams", "Pounds"]
};

// Get elements
const cards = document.querySelectorAll(".dashboard-card");
const selectedTitle = document.getElementById("selectedTitle");

const convertModeBtn = document.getElementById("convertModeBtn");
const compareModeBtn = document.getElementById("compareModeBtn");
const arithmeticModeBtn = document.getElementById("arithmeticModeBtn");

const firstValue = document.getElementById("firstValue");
const secondValue = document.getElementById("secondValue");

const firstUnit = document.getElementById("firstUnit");
const secondUnit = document.getElementById("secondUnit");
const resultUnit = document.getElementById("resultUnit");

const operatorBox = document.getElementById("operatorBox");
const operatorSelect = document.getElementById("operatorSelect");
const resultUnitBox = document.getElementById("resultUnitBox");

const actionBtn = document.getElementById("actionBtn");
const resultValue = document.getElementById("resultValue");
const dashboardMessage = document.getElementById("dashboardMessage");
const historyList = document.getElementById("historyList");


const historyBtn = document.getElementById("historyBtn");
const historySection = document.getElementById("historySection");

const logoutBtn = document.getElementById("logoutBtn");

// Initial load
loadUnits(currentType);
updateOperationUI();
loadHistory();

/* ================= TYPE CARD EVENTS ================= */
cards.forEach((card) => {
  card.addEventListener("click", function () {
    cards.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");

    currentType = this.dataset.type;

    selectedTitle.textContent =
      currentType.charAt(0).toUpperCase() + currentType.slice(1) + " Measurement";

    loadUnits(currentType);

    // Temperature me comparison allowed nahi
    if (currentType === "temperature" && currentOperation === "compare") {
      currentOperation = "convert";
    }

    updateOperationUI();
    clearResult();
  });
});

/* ================= OPERATION BUTTON EVENTS ================= */
convertModeBtn.addEventListener("click", function () {
  currentOperation = "convert";
  updateOperationUI();
  clearResult();
});

compareModeBtn.addEventListener("click", function () {
  if (currentType === "temperature") {
    return;
  }

  currentOperation = "compare";
  updateOperationUI();
  clearResult();
});

arithmeticModeBtn.addEventListener("click", function () {
  currentOperation = "arithmetic";
  updateOperationUI();
  clearResult();
});

// Top right history link click
historyBtn.addEventListener("click", function (e) {
  e.preventDefault();

  historySection.scrollIntoView({
    behavior: "smooth"
  });
});

// Logout button click
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // Remove saved login data
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    // Redirect to login page
    window.location.href = "login.html";
  });
}
/* ================= MAIN ACTION BUTTON ================= */
actionBtn.addEventListener("click", async function () {
  dashboardMessage.style.color = "red";
  dashboardMessage.textContent = "";

  const value1 = parseFloat(firstValue.value);
  const value2 = parseFloat(secondValue.value);

  if (isNaN(value1)) {
    dashboardMessage.textContent = "Please enter first value";
    return;
  }

  if (currentOperation === "convert") {
    const result = convertValue(currentType, value1, firstUnit.value, resultUnit.value);

    if (result === null) {
      dashboardMessage.textContent = "Conversion not possible";
      return;
    }

    resultValue.value = `${result} ${resultUnit.value}`;
    dashboardMessage.style.color = "green";
    dashboardMessage.textContent = "Conversion successful";

    await saveHistory({
      type: currentType,
      operation: "convert",
      firstValue: value1,
      firstUnit: firstUnit.value,
      secondValue: null,
      secondUnit: null,
      operator: null,
      result: `${result} ${resultUnit.value}`
    });
  }

  else if (currentOperation === "compare") {
    if (isNaN(value2)) {
      dashboardMessage.textContent = "Please enter second value";
      return;
    }

    const areEqual = compareValues(currentType, value1, firstUnit.value, value2, secondUnit.value);

    resultValue.value = areEqual ? "Equal" : "Not Equal";
    dashboardMessage.style.color = "green";
    dashboardMessage.textContent = "Comparison successful";

    await saveHistory({
      type: currentType,
      operation: "compare",
      firstValue: value1,
      firstUnit: firstUnit.value,
      secondValue: value2,
      secondUnit: secondUnit.value,
      operator: "==",
      result: areEqual ? "Equal" : "Not Equal"
    });
  }

  else if (currentOperation === "arithmetic") {
    if (isNaN(value2)) {
      dashboardMessage.textContent = "Please enter second value";
      return;
    }

    const result = doArithmetic(
      currentType,
      value1,
      firstUnit.value,
      value2,
      secondUnit.value,
      operatorSelect.value,
      resultUnit.value
    );

    if (result === null) {
      dashboardMessage.textContent = "Arithmetic operation not possible";
      return;
    }

    resultValue.value = `${result} ${resultUnit.value}`;
    dashboardMessage.style.color = "green";
    dashboardMessage.textContent = "Arithmetic operation successful";

    await saveHistory({
      type: currentType,
      operation: "arithmetic",
      firstValue: value1,
      firstUnit: firstUnit.value,
      secondValue: value2,
      secondUnit: secondUnit.value,
      operator: operatorSelect.value,
      result: `${result} ${resultUnit.value}`
    });
  }

  loadHistory();
});

/* ================= UI HELPERS ================= */
function updateOperationUI() {
  convertModeBtn.classList.remove("active-op");
  compareModeBtn.classList.remove("active-op");
  arithmeticModeBtn.classList.remove("active-op");

  if (currentOperation === "convert") {
    convertModeBtn.classList.add("active-op");
    actionBtn.textContent = "Convert";
    operatorBox.style.display = "none";
    resultUnitBox.style.display = "block";
    secondValue.parentElement.style.display = "none";
  }

  if (currentOperation === "compare") {
    compareModeBtn.classList.add("active-op");
    actionBtn.textContent = "Compare";
    operatorBox.style.display = "none";
    resultUnitBox.style.display = "none";
    secondValue.parentElement.style.display = "block";
  }

  if (currentOperation === "arithmetic") {
    arithmeticModeBtn.classList.add("active-op");
    actionBtn.textContent = "Apply Arithmetic";
    operatorBox.style.display = "block";
    resultUnitBox.style.display = "block";
    secondValue.parentElement.style.display = "block";
  }

  // Temperature ke liye compare disable
  if (currentType === "temperature") {
    arithmeticModeBtn.disabled = true;
  } else {
    arithmeticModeBtn.disabled = false;
  }
}

function clearResult() {
  resultValue.value = "";
  dashboardMessage.textContent = "";
}

/* ================= UNIT LOADING ================= */
function loadUnits(type) {
  const units = unitsData[type];

  firstUnit.innerHTML = "";
  secondUnit.innerHTML = "";
  resultUnit.innerHTML = "";

  units.forEach((unit) => {
    const option1 = document.createElement("option");
    option1.value = unit;
    option1.textContent = unit;
    firstUnit.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = unit;
    option2.textContent = unit;
    secondUnit.appendChild(option2);

    const option3 = document.createElement("option");
    option3.value = unit;
    option3.textContent = unit;
    resultUnit.appendChild(option3);
  });
}

/* ================= MAIN CONVERSION ================= */
function convertValue(type, value, from, to) {
  if (type === "length") return convertLength(value, from, to);
  if (type === "temperature") return convertTemperature(value, from, to);
  if (type === "volume") return convertVolume(value, from, to);
  if (type === "weight") return convertWeight(value, from, to);
  return null;
}

/* ================= COMPARISON ================= */
function compareValues(type, value1, unit1, value2, unit2) {
  const base1 = convertToBase(type, value1, unit1);
  const base2 = convertToBase(type, value2, unit2);

  if (base1 === null || base2 === null) return false;

  return Math.abs(base1 - base2) < 0.0001;
}

/* ================= ARITHMETIC ================= */
function doArithmetic(type, value1, unit1, value2, unit2, operator, targetUnit) {
  const base1 = convertToBase(type, value1, unit1);
  const base2 = convertToBase(type, value2, unit2);

  if (base1 === null || base2 === null) return null;

  let baseResult;

  if (operator === "+") baseResult = base1 + base2;
  else if (operator === "-") baseResult = base1 - base2;
  else if (operator === "*") baseResult = base1 * base2;
  else if (operator === "/") {
    if (base2 === 0) return null;
    baseResult = base1 / base2;
  } else {
    return null;
  }

  return convertFromBase(type, baseResult, targetUnit);
}

/* ================= BASE CONVERSION ================= */
function convertToBase(type, value, unit) {
  if (type === "length") {
    if (unit === "Metres") return value;
    if (unit === "Centimetres") return value / 100;
    if (unit === "Kilometres") return value * 1000;
  }

  if (type === "temperature") {
    if (unit === "Celsius") return value;
    if (unit === "Fahrenheit") return (value - 32) * 5 / 9;
    if (unit === "Kelvin") return value - 273.15;
  }

  if (type === "volume") {
    if (unit === "Litres") return value;
    if (unit === "Millilitres") return value / 1000;
    if (unit === "Gallons") return value * 3.78541;
  }

  if (type === "weight") {
    if (unit === "Kilograms") return value;
    if (unit === "Grams") return value / 1000;
    if (unit === "Pounds") return value * 0.453592;
  }

  return null;
}

function convertFromBase(type, value, unit) {
  if (type === "length") {
    if (unit === "Metres") return roundNumber(value);
    if (unit === "Centimetres") return roundNumber(value * 100);
    if (unit === "Kilometres") return roundNumber(value / 1000);
  }

  if (type === "temperature") {
    if (unit === "Celsius") return roundNumber(value);
    if (unit === "Fahrenheit") return roundNumber((value * 9 / 5) + 32);
    if (unit === "Kelvin") return roundNumber(value + 273.15);
  }

  if (type === "volume") {
    if (unit === "Litres") return roundNumber(value);
    if (unit === "Millilitres") return roundNumber(value * 1000);
    if (unit === "Gallons") return roundNumber(value / 3.78541);
  }

  if (type === "weight") {
    if (unit === "Kilograms") return roundNumber(value);
    if (unit === "Grams") return roundNumber(value * 1000);
    if (unit === "Pounds") return roundNumber(value / 0.453592);
  }

  return null;
}

/* ================= DIRECT CONVERSION ================= */
function convertLength(value, from, to) {
  return convertFromBase("length", convertToBase("length", value, from), to);
}

function convertTemperature(value, from, to) {
  return convertFromBase("temperature", convertToBase("temperature", value, from), to);
}

function convertVolume(value, from, to) {
  return convertFromBase("volume", convertToBase("volume", value, from), to);
}

function convertWeight(value, from, to) {
  return convertFromBase("weight", convertToBase("weight", value, from), to);
}

/* ================= ROUNDING ================= */
function roundNumber(value) {
  return Number(value.toFixed(2));
}

/* ================= HISTORY SAVE ================= */
async function saveHistory(data) {
  try {
    await fetch(`${BASE_URL}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.log("Error saving history:", error);
  }
}

/* ================= HISTORY LOAD ================= */
async function loadHistory() {
  try {
    const response = await fetch(`${BASE_URL}/history`);

    if (!response.ok) {
      throw new Error("Failed to load history");
    }

    const history = await response.json();

    historyList.innerHTML = "";

    // If no history is present
    if (history.length === 0) {
      historyList.innerHTML = "<li>No history found</li>";
      return;
    }

    // Show latest 5 history records
    history.slice(-5).reverse().forEach((item) => {
      const li = document.createElement("li");

      li.textContent =
        `${item.type.toUpperCase()} | ${item.operation.toUpperCase()} | ` +
        `${item.firstValue} ${item.firstUnit} ` +
        `${item.operator ? item.operator : ""} ` +
        `${item.secondValue !== null ? item.secondValue + " " + item.secondUnit : ""} ` +
        ` = ${item.result}`;

      historyList.appendChild(li);
    });
  } catch (error) {
    historyList.innerHTML = "<li>History not available</li>";
    console.log("History load error:", error);
  }
}