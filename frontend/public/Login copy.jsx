import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    alert(`Logging in with Email: ${email}`);
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img
          src="public/TV_logo_Horisontal_rod_RGB.png"
          alt="logo"
          className="logo"
        />
        <div className="login-form">
          <h1 className="form-title">Login</h1>
          <p className="form-subtitle">Email</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <p className="form-subtitle">Password</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
