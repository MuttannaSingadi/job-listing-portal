import { useState } from "react";
import "./auth.css";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // ⭐ production backend
  const API = "https://job-listing-portal-iu9g.onrender.com";

  // =============================
  // SIGNUP
  // =============================
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      if (signupData.password !== signupData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await axios.post(`${API}/api/auth/signup`, {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      alert(res.data.msg);
      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  // =============================
  // LOGIN
  // =============================
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, loginData);
      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  // =============================
  // RESET PASSWORD
  // =============================
  const handleForgotPassword = async () => {
    const email = prompt("Enter your email:");
    const newPassword = prompt("Enter new password:");

    if (!email || !newPassword) return;

    try {
      const res = await axios.post(`${API}/api/auth/reset-password`, {
        email,
        newPassword,
      });

      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="container">
      {/* Login */}
      <div
        className={`form-container ${!isLogin ? "slide-in-right" : ""}`}
        id="loginForm"
        style={{
          display: isLogin ? "flex" : "none",
          transform: isLogin ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <h2>
          <i className="fas fa-right-to-bracket"></i> Login
        </h2>

        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleLoginChange}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleLoginChange}
          />
        </div>

        <button
          className="forgot-password"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>

        <button onClick={handleLogin}>Login</button>
      </div>

      {/* Signup */}
      <div
        className={`form-container ${isLogin ? "slide-in-left" : ""}`}
        id="signupForm"
        style={{
          display: isLogin ? "none" : "flex",
          transform: isLogin ? "translateX(100%)" : "translateX(0)",
        }}
      >
        <h2>
          <i className="fas fa-user-plus"></i> Sign Up
        </h2>

        <div className="input-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleSignupChange}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleSignupChange}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleSignupChange}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleSignupChange}
          />
        </div>

        <button onClick={handleSignup}>Sign Up</button>
      </div>

      {/* Overlay */}
      <div
        className="overlay-container"
        style={{ left: isLogin ? "50%" : "0" }}
      >
        <h2>
          {isLogin ? "Welcome Back!" : "Hello, Friend!"}
        </h2>

        <p>
          {isLogin
            ? "To keep connected, please login with your personal info"
            : "Enter your details and start your journey with us"}
        </p>

        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
}
