import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import axios from "axios";
import logo from "../assets/image.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const API = "https://job-listing-portal-iu9g.onrender.com";

  // ================= SIGNUP =================
  const [signupData, setSignupData] = useState({
    role: "jobseeker",
    name: "",
    location: "",
    companyName: "",
    contactPerson: "",
    companyLocation: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!signupData.email || !signupData.password) {
      alert("Email & Password required");
      return;
    }

    if (!emailRegex.test(signupData.email)) {
      alert("Enter valid email (example@gmail.com)");
      return;
    }

    if (!/^\d{12}$/.test(signupData.phone)) {
      alert("Phone number must be exactly 12 digits");
      return;
    }

    if (!passwordRegex.test(signupData.password)) {
      alert(
        "Password must contain:\n• 8+ characters\n• 1 uppercase\n• 1 lowercase\n• 1 number\n• 1 special character"
      );
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${API}/api/auth/signup`, signupData);
      alert("Registration successful ✅");

      setSignupData({
        role: "jobseeker",
        name: "",
        location: "",
        companyName: "",
        contactPerson: "",
        companyLocation: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  // ================= LOGIN =================
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      alert("Enter email & password");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/login`, loginData);

      // Save token if exists
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert(res.data.msg);

      // Redirect to Home
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  // ================= RESET =================
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
    <>
      {/* Header */}
      <div className="top-header">
        <div className="brand">
          <img src={logo} alt="DevHire Logo" />
        </div>

        <div className="nav-buttons">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="container">
        {/* LOGIN */}
        {isLogin && (
          <div className="form-container">
            <h2>Login</h2>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
              />
            </div>

            <button className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </button>

            <button onClick={handleLogin}>Login</button>
          </div>
        )}

        {/* SIGNUP */}
        {!isLogin && (
          <div className="form-container">
            <h2>Sign Up</h2>

            <div className="role-select">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={signupData.role === "jobseeker"}
                  onChange={handleSignupChange}
                />
                Job Seeker
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="employer"
                  checked={signupData.role === "employer"}
                  onChange={handleSignupChange}
                />
                Employer
              </label>
            </div>

            {signupData.role === "jobseeker" && (
              <>
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="location"
                    placeholder="City / Country"
                    value={signupData.location}
                    onChange={handleSignupChange}
                  />
                </div>
              </>
            )}

            {signupData.role === "employer" && (
              <>
                <div className="input-group">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={signupData.companyName}
                    onChange={handleSignupChange}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="Full Name"
                    value={signupData.contactPerson}
                    onChange={handleSignupChange}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="companyLocation"
                    placeholder="Location"
                    value={signupData.companyLocation}
                    onChange={handleSignupChange}
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
              />
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={signupData.phone}
                maxLength={12}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 12) {
                    setSignupData({ ...signupData, phone: value });
                  }
                }}
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
              />
              <span onClick={() => setShowPassword(!showPassword)}>👁</span>
            </div>

            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                👁
              </span>
            </div>

            <button onClick={handleSignup}>Sign Up</button>
          </div>
        )}

        <div className="overlay-container">
          <h2>{isLogin ? "Welcome Back!" : "Hello, Friend!"}</h2>

          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Sign Up" : "Switch to Login"}
          </button>
        </div>
      </div>
    </>
  );
}