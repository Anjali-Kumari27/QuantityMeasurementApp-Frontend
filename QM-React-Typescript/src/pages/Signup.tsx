import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
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

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setMessageColor("red");
      setMessage("Full Name, Email and Password are required");
      return;
    }

    if (!isValidEmail(email)) {
      setMessageColor("red");
      setMessage("Please enter a valid email address");
      return;
    }

    if (!isValidPassword(password)) {
      setMessageColor("red");
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
      return;
    }

    try {
      const response = await registerUser({
        fullName: name,
        email,
        password,
      });

      localStorage.setItem("token", response.token);

      setMessageColor("green");
      setMessage("Signup successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessageColor("red");
      setMessage(error instanceof Error ? error.message : "Registration failed");
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

        <div className="right-panel signup-panel">
          <div className="tabs">
            <Link to="/login" className="tab">
              LOGIN
            </Link>
            <Link to="/signup" className="tab active">
              SIGNUP
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />

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

            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
            />

            <button type="submit">Signup</button>

            <p className="switch-row">
               <span>Already have an account?</span>
               <Link to="/login">Login</Link>
            </p>
            
            <p className="auth-message" style={{ color: messageColor }}>
              {message}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}