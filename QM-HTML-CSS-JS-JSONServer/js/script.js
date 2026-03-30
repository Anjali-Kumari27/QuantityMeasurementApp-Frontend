const BASE_URL = "http://localhost:3000";

// PASSWORD TOGGLE
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// PASSWORD VALIDATION
function isValidPassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(password);
}

/* ================= SIGNUP ================= */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    const message = document.getElementById("signupMessage");

    if (!name || !email || !password || !mobile) {
      message.textContent = "All fields are required";
      return;
    }

    if (!isValidPassword(password)) {
      message.textContent =
        "Password must contain uppercase, lowercase, number & special char";
      return;
    }

    try {
      // Check if user already exists
      const res = await fetch(`${BASE_URL}/users?email=${email}`);
      const data = await res.json();

      if (data.length > 0) {
        message.textContent = "User already exists";
        return;
      }

      // Save user
      await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, mobile })
      });

      message.style.color = "green";
      message.textContent = "Signup successful";

      // Redirect to login
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);

    } catch (error) {
      message.textContent = "Error connecting to server";
    }
  });
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const message = document.getElementById("loginMessage");

    if (!email || !password) {
      message.textContent = "All fields are required";
      return;
    }

    try {
      // Fetch user
      const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
      const data = await res.json();

      if (data.length === 0) {
        message.textContent = "Invalid credentials";
        return;
      }

      message.style.color = "green";
      message.textContent = "Login successful";

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(data[0]));

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    } catch (error) {
      message.textContent = "Server error";
    }
  });
}