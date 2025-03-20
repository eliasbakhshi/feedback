import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../store/api/userApiSlice";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const recaptcha = useRef<ReCAPTCHA>(null);

  const [registerUser, { isLoading}] = useRegisterUserMutation();

  const handleRegistration = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      toast.error("Alla fält måste fyllas i!");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(email)) {
      recaptcha.current?.reset();
      toast.error("Ange en giltig e-postadress!");
      return;
    }

    if (password.length < 6) {
      recaptcha.current?.reset();
      toast.warning("Lösenordet måste vara minst 6 tecken långt!");
      return;
    }
    // // /* Check the recaptcha before submitting */
    const recaptchaToken = recaptcha.current?.getValue();
    if(!recaptchaToken){
      toast.error('Vänligen skicka in Captcha');
      return;
    }

    try {
      const userData = {firstName, lastName, email, password, recaptchaToken, role: "operator" };
      await registerUser(userData).unwrap();
      navigate("/verify");
    } catch (error: any) {
      const errorMessage = error.data?.message || "Något gick fel!";
      recaptcha.current?.reset();
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('./highway.jpg')] bg-cover bg-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <img
          src="/TV_logo_Horisontal_rod_RGB.png"
          alt="logo"
          className="w-80 mx-auto mb-8"
        />
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Registrera konto</h1>
          <p className="block text-sm font-medium text-gray-600">Förnamn</p>
          <input
            type="text"
            placeholder="Förnamn"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
          />
          <p className="block text-sm font-medium text-gray-600">Efternamn</p>
          <input
            type="text"
            placeholder="Efternamn"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
          />
          <p className="block text-sm font-medium text-gray-600">Email</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
          />
          <p className="block text-sm font-medium text-gray-600">Lösenord</p>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
          />
          <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} ref={recaptcha} className="my-3"/>
          <button className="w-24 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" onClick={handleRegistration} disabled={isLoading}>
            Registrera
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
