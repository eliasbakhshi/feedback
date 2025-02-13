
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../store/api/userApiSlice";


const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [registerUser, { isLoading}] = useRegisterUserMutation();

  const handleRegistration = async () => {
    const username = name.trim().toLowerCase().replace(" ", "_");
    const role = "agent"
    const userData = { username, name, email, password, role};
    await registerUser(userData);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <img
          src="/TV_logo_Horisontal_rod_RGB.png"
          alt="logo"
          className="w-80 mx-auto mb-8"
        />
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Registrera konto</h1>
          <p className="block text-sm font-medium text-gray-600">Namn</p>
          <input
            type="text"
            placeholder="Förnamn Efternamn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="block text-sm font-medium text-gray-600">Email</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="block text-sm font-medium text-gray-600">Lösenord</p>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="w-20 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" onClick={handleRegistration} disabled={isLoading}>
            Registrera
          </button>
        </div>
      </div>
    </div>
  );
};

  

export default Registration;
