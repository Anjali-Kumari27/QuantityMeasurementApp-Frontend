// Show / Hide password
function togglePassword(id) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

// Password validation
function isValidPassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return regex.test(password);
}

/* ================= SIGNUP ================= */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const message = document.getElementById("signupMessage");

    message.style.color = "red";

    if (!name || !email || !password || !mobile) {
      message.textContent = "All fields are required";
      return;
    }

    if (!isValidPassword(password)) {
      message.textContent =
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character";
      return;
    }

    message.style.color = "green";
    message.textContent = "Signup successful";
  });
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    message.style.color = "red";

    if (!email || !password) {
      message.textContent = "All fields are required";
      return;
    }

    message.style.color = "green";
    message.textContent = "Login successful";
  });
}