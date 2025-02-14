
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Account = () => {
  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <button 
            onClick={() => navigate("/")}
            className="text-2xl absolute top-4 left-4 p-2 cursor-pointer text-gray-800 hover:text-gray-600"
            >
            ←
        </button>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Konto inställningar</h1>
          <div className="flex items-center space-x-4">
            <img src="/TV_logo_Master_Symbol_rgb.png" alt="logo" className="w-20 rounded-full"/>
            <div>
              <p className="text-2xl font-medium text-gray-600">Namn namnsson</p>
              <p className="text-xs font-medium text-gray-600">Team manager avdelning A</p>
              
            </div>
          </div>
          <div className="p-4 rounded-lg space-y-2 border border-gray-300">
            <img src="/pen.png" alt="edit" className="w-4 top-2 right-2 cursor-pointer"/>
            <p className="text-sm font-medium text-gray-600">Namn</p>
            <p className="text-xs font-medium text-gray-600">Namn Namnsson</p>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-xs font-medium text-gray-600">namn.namnsson@trafikverket.se</p>
            <p className="text-sm font-medium text-gray-600 mt-2">Lösenord</p>
            <p className="text-xs font-medium text-gray-600 mt-2">**********</p>
          </div>
          <button className="w-20 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" onClick={handleRegistration}>
            Registrera
          </button>
        </div>
      </div>
    </div>
  );
};

  

export default Account;
