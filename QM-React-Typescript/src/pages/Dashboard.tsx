import { useEffect, useState } from "react";
import {
  addQuantity,
  buildQuantityDTO,
  compareQuantity,
  convertQuantity,
  divideQuantity,
  getHistoryByMeasurementType,
  subtractQuantity,
} from "../services/api";
import type {
  MeasurementType,
  OperationType,
  QuantityInputDTO,
  QuantityMeasurementDTO,
} from "../types";
import { useNavigate } from "react-router-dom";

const unitsData: Record<MeasurementType, string[]> = {
  LengthUnit: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
  WeightUnit: ["KILOGRAM", "GRAM", "POUND"],
  VolumeUnit: ["LITRE", "MILLILITRE", "GALLON"],
  TemperatureUnit: ["CELSIUS", "FAHRENHEIT", "KELVIN"],
};

const measurementLabels: Record<MeasurementType, string> = {
  LengthUnit: "Length Measurement",
  WeightUnit: "Weight Measurement",
  VolumeUnit: "Volume Measurement",
  TemperatureUnit: "Temperature Measurement",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [currentType, setCurrentType] = useState<MeasurementType>("LengthUnit");
  const [currentOperation, setCurrentOperation] =
    useState<OperationType>("convert");

  const [firstValue, setFirstValue] = useState("1");
  const [secondValue, setSecondValue] = useState("1");

  const [firstUnit, setFirstUnit] = useState("FEET");
  const [secondUnit, setSecondUnit] = useState("INCHES");
  const [resultUnit, setResultUnit] = useState("INCHES");

  const [resultValue, setResultValue] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [history, setHistory] = useState<QuantityMeasurementDTO[]>([]);

  useEffect(() => {
    loadDefaultUnits(currentType);

    if (currentType === "TemperatureUnit" && currentOperation !== "convert" && currentOperation !== "compare") {
      setCurrentOperation("convert");
    }

    setResultValue("");
    setMessage("");
  }, [currentType]);

  useEffect(() => {
    loadHistory();
  }, [currentType]);

  function loadDefaultUnits(type: MeasurementType) {
    if (type === "LengthUnit") {
      setFirstUnit("FEET");
      setSecondUnit("INCHES");
      setResultUnit("INCHES");
    } else if (type === "WeightUnit") {
      setFirstUnit("KILOGRAM");
      setSecondUnit("GRAM");
      setResultUnit("GRAM");
    } else if (type === "VolumeUnit") {
      setFirstUnit("LITRE");
      setSecondUnit("MILLILITRE");
      setResultUnit("MILLILITRE");
    } else if (type === "TemperatureUnit") {
      setFirstUnit("CELSIUS");
      setSecondUnit("FAHRENHEIT");
      setResultUnit("FAHRENHEIT");
    }
  }

  async function loadHistory() {
    try {
      const data = await getHistoryByMeasurementType(currentType);
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }

  function buildPayload(withTargetUnit: boolean): QuantityInputDTO {
    const thisQuantityDTO = buildQuantityDTO(
      Number(firstValue),
      firstUnit,
      currentType
    );

    const thatQuantityDTO = buildQuantityDTO(
      Number(secondValue),
      secondUnit,
      currentType
    );

    if (withTargetUnit) {
      return {
        thisQuantityDTO,
        thatQuantityDTO,
        targetUnitDTO: buildQuantityDTO(0, resultUnit, currentType),
      };
    }

    return {
      thisQuantityDTO,
      thatQuantityDTO,
      targetUnitDTO: null,
    };
  }

  async function handleAction() {
    setMessage("");
    setResultValue("");
    setMessageColor("red");

    const parsedFirst = Number(firstValue);
    const parsedSecond = Number(secondValue);

    if (Number.isNaN(parsedFirst)) {
      setMessage("Please enter first value");
      return;
    }

    try {
      let response: QuantityMeasurementDTO;

      if (currentOperation === "convert") {
        const payload: QuantityInputDTO = {
          thisQuantityDTO: buildQuantityDTO(parsedFirst, firstUnit, currentType),
          thatQuantityDTO: buildQuantityDTO(0, resultUnit, currentType),
          targetUnitDTO: null,
        };

        response = await convertQuantity(payload);
      } else if (currentOperation === "compare") {
        if (Number.isNaN(parsedSecond)) {
          setMessage("Please enter second value");
          return;
        }

        response = await compareQuantity({
          thisQuantityDTO: buildQuantityDTO(parsedFirst, firstUnit, currentType),
          thatQuantityDTO: buildQuantityDTO(parsedSecond, secondUnit, currentType),
          targetUnitDTO: null,
        });
      } else if (currentOperation === "add") {
        if (currentType === "TemperatureUnit") {
          setMessage("Temperature does not support add operation");
          return;
        }

        if (Number.isNaN(parsedSecond)) {
          setMessage("Please enter second value");
          return;
        }

        response = await addQuantity(buildPayload(true));
      } else if (currentOperation === "subtract") {
        if (currentType === "TemperatureUnit") {
          setMessage("Temperature does not support subtract operation");
          return;
        }

        if (Number.isNaN(parsedSecond)) {
          setMessage("Please enter second value");
          return;
        }

        response = await subtractQuantity(buildPayload(true));
      } else {
        if (currentType === "TemperatureUnit") {
          setMessage("Temperature does not support divide operation");
          return;
        }

        if (Number.isNaN(parsedSecond)) {
          setMessage("Please enter second value");
          return;
        }

        response = await divideQuantity({
          thisQuantityDTO: buildQuantityDTO(parsedFirst, firstUnit, currentType),
          thatQuantityDTO: buildQuantityDTO(parsedSecond, secondUnit, currentType),
          targetUnitDTO: null,
        });
      }

      if (response.isError) {
        setMessageColor("red");
        setMessage(response.resultString || "Operation failed");
      } else {
        setMessageColor("green");
        setMessage("Operation successful");

        if (response.resultString) {
          setResultValue(response.resultString);
        } else if (response.resultValue !== null) {
          const unitPart = response.resultUnit ? ` ${response.resultUnit}` : "";
          setResultValue(`${response.resultValue}${unitPart}`);
        }
      }

      await loadHistory();
    } catch (error) {
      setMessageColor("red");
      setMessage(error instanceof Error ? error.message : "Operation failed");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  }

  return (
    <div className="dashboard-body">
      <div className="dashboard-page">
        <div className="dashboard-breadcrumb">
          <span>Quantity Measurement</span>
          <span className="dashboard-arrow">&gt;</span>
          <span>{measurementLabels[currentType]}</span>
        </div>

        <div className="dashboard-topbar">
          <h2>QUANTITY MEASUREMENT APP</h2>
          <button
            className="top-link-btn"
            onClick={() =>
              document
                .getElementById("historySection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            History
          </button>
        </div>

        <div className="dashboard-welcome">
          <h1>Welcome To Quantity Measurement</h1>
        </div>

        <div className="dashboard-container">
          <div className="dashboard-header-row">
            <h3>CHOOSE TYPE</h3>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="dashboard-cards">
            <div
              className={`dashboard-card ${currentType === "LengthUnit" ? "active" : ""}`}
              data-type="length"
              onClick={() => setCurrentType("LengthUnit")}
            >
              <div className="dashboard-icon">📏</div>
              <p>Length</p>
            </div>

            <div
              className={`dashboard-card ${currentType === "TemperatureUnit" ? "active" : ""}`}
              data-type="temperature"
              onClick={() => setCurrentType("TemperatureUnit")}
            >
              <div className="dashboard-icon">🌡️</div>
              <p>Temperature</p>
            </div>

            <div
              className={`dashboard-card ${currentType === "VolumeUnit" ? "active" : ""}`}
              data-type="volume"
              onClick={() => setCurrentType("VolumeUnit")}
            >
              <div className="dashboard-icon">🧪</div>
              <p>Volume</p>
            </div>

            <div
              className={`dashboard-card ${currentType === "WeightUnit" ? "active" : ""}`}
              data-type="weight"
              onClick={() => setCurrentType("WeightUnit")}
            >
              <div className="dashboard-icon">⚖️</div>
              <p>Weight</p>
            </div>
          </div>

          <h3>CHOOSE OPERATION</h3>
          <div className="dashboard-operation-buttons">
            <button
              className={`op-btn ${currentOperation === "convert" ? "active-op" : ""}`}
              onClick={() => setCurrentOperation("convert")}
            >
              Convert
            </button>

            <button
              className={`op-btn ${currentOperation === "compare" ? "active-op" : ""}`}
              onClick={() => setCurrentOperation("compare")}
            >
              Compare
            </button>

            <button
              className={`op-btn ${currentOperation === "add" ? "active-op" : ""}`}
              onClick={() => setCurrentOperation("add")}
              disabled={currentType === "TemperatureUnit"}
            >
              Add
            </button>

            <button
              className={`op-btn ${currentOperation === "subtract" ? "active-op" : ""}`}
              onClick={() => setCurrentOperation("subtract")}
              disabled={currentType === "TemperatureUnit"}
            >
              Subtract
            </button>

            <button
              className={`op-btn ${currentOperation === "divide" ? "active-op" : ""}`}
              onClick={() => setCurrentOperation("divide")}
              disabled={currentType === "TemperatureUnit"}
            >
              Divide
            </button>
          </div>

          <div className="dashboard-conversion">
            <div className="dashboard-box">
              <label>FIRST VALUE</label>
              <input
                type="number"
                value={firstValue}
                onChange={(e) => setFirstValue(e.target.value)}
              />
              <select value={firstUnit} onChange={(e) => setFirstUnit(e.target.value)}>
                {unitsData[currentType].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {currentOperation !== "convert" && (
              <div className="dashboard-box">
                <label>SECOND VALUE</label>
                <input
                  type="number"
                  value={secondValue}
                  onChange={(e) => setSecondValue(e.target.value)}
                />
                <select value={secondUnit} onChange={(e) => setSecondUnit(e.target.value)}>
                  {unitsData[currentType].map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {currentOperation !== "compare" && currentOperation !== "divide" && (
            <div className="dashboard-result-unit-box">
              <label>RESULT UNIT</label>
              <select value={resultUnit} onChange={(e) => setResultUnit(e.target.value)}>
                {unitsData[currentType].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className="dashboard-convert-btn" onClick={handleAction}>
            {currentOperation === "convert" && "Convert"}
            {currentOperation === "compare" && "Compare"}
            {currentOperation === "add" && "Add"}
            {currentOperation === "subtract" && "Subtract"}
            {currentOperation === "divide" && "Divide"}
          </button>

          <div className="dashboard-result-box">
            <label>RESULT</label>
            <input type="text" value={resultValue} readOnly />
          </div>

          <p className="dashboard-message" style={{ color: messageColor }}>
            {message}
          </p>

          <div className="dashboard-history" id="historySection">
            <h3>Recent History</h3>
            <ul id="historyList">
              {history.length === 0 ? (
                <li>No history found</li>
              ) : (
                history.slice(-5).reverse().map((item, index) => (
                  <li key={index}>
                    {item.operation?.toUpperCase()} |{" "}
                    {item.resultString
                      ? item.resultString
                      : `${item.resultValue ?? ""} ${item.resultUnit ?? ""}`}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}