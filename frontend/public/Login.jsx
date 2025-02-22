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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/images/image.png')" }}>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        
        {/* Trafikverket Logotyp */}
        <div className="flex justify-center mb-6">
          <img
            src="/TV_logo_Horisontal_rod_RGB.png"
            alt="Trafikverket Logo"
            className="w-40"
          />
        </div>

        {/* Login Form */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-red-600 text-center mb-4">
            Login
          </h1>

          <label className="text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-3 w-full focus:ring-2 focus:ring-red-400"
          />

          <label className="text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:ring-2 focus:ring-red-400"
          />

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
