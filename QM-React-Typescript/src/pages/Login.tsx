import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

  // Email validation
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation
  function isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessageColor("red");
      setMessage("All fields are required");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setMessageColor("red");
      setMessage("Please enter a valid email address");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setMessageColor("red");
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
      return;
    }

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("userEmail", formData.email);

      setMessageColor("green");
      setMessage("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessageColor("red");
      setMessage(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="main-container">
        <div className="left-panel">
          <div className="image-circle">
            <img src="/measurement.png" alt="Measurement Logo" />
          </div>
          <h2>
            QUANTITY
            <br />
            MEASUREMENT APP
          </h2>
        </div>

        <div className="right-panel">
          <div className="tabs">
            <Link to="/login" className="tab active">
              LOGIN
            </Link>
            <Link to="/signup" className="tab">
              SIGNUP
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Id</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <div className="password-box">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
              />
              <span className="eye" onClick={() => setShowPassword((prev) => !prev)}>
                👁
              </span>
            </div>

            <button type="submit">Login</button>

            <p className="auth-message" style={{ color: messageColor }}>
              {message}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}