<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../store/api/userApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const [fullname, setName] = useState("");
=======

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../store/api/userApiSlice";


const Registration = () => {
  const [name, setName] = useState("");
>>>>>>> origin/loginpageDesign
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

<<<<<<< HEAD
  const [registerUser, { isLoading}] = useRegisterUserMutation();

  const handleRegistration = async () => {
    if (!fullname.trim() || !email.trim() || !password.trim()) {
      toast.error("Alla fält måste fyllas i!", { position: "top-right" });
      return;
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(email)) {
      toast.error("Ange en giltig e-postadress!", { position: "top-right" });
      return;
    }

    if (password.length < 6) {
      toast.warning("Lösenordet måste vara minst 6 tecken långt!", { position: "top-right" });
      return;
    }
    
    try {
      const userData = {fullname, email, password };
      await registerUser(userData).unwrap();
      toast.success(`Välkommen ${fullname}!`, { position: "top-right" });
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.originalStatus;
      switch (errorMessage) {
        case 400:
          toast.error("Användaren finns redan!", { position: "top-right" });
          break;
        default:
          toast.error("Något gick fel!", { position: "top-right" });  
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('./public/highway.jpg')] bg-cover bg-center">
=======
  const [registerUser, { isloading, error}] = useRegisterUserMutation();

  const handleRegistration = () => {
    alert(`Välkommen ${name}!`);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
>>>>>>> origin/loginpageDesign
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
<<<<<<< HEAD
            value={fullname}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
=======
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
>>>>>>> origin/loginpageDesign
          />
          <p className="block text-sm font-medium text-gray-600">Email</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
=======
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
>>>>>>> origin/loginpageDesign
          />
          <p className="block text-sm font-medium text-gray-600">Lösenord</p>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
          />
          <button className="w-24 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" onClick={handleRegistration} disabled={isLoading}>
            Registrera
=======
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="w-20 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" onClick={handleRegistration}>
            Logga in
>>>>>>> origin/loginpageDesign
          </button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
=======
  

>>>>>>> origin/loginpageDesign
export default Registration;
