import { useEffect } from "react";
import { useParams } from "react-router";
import { useConfirmUserMutation } from "../../store/api/userApiSlice";
import { LiaCheckCircleSolid } from "react-icons/lia";
const verified = () => {
  const { token } = useParams<{ token: string }>();
  const [confirmUser] = useConfirmUserMutation();

  useEffect(() => {
      if (token) {
          confirmUser({ token });
      }
  }, [token, confirmUser]);
  
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
        <div className="w-200 bg-white p-4 mt-8 rounded-lg mt-4 jsutify-center items-center flex flex-col shadow-md">
        <img
          src="/TV_logo_Horisontal_rod_RGB.png"
          alt="logo"
          className="w-80 mx-auto mb-8"
        />
        <hr className="w-full mt-2 border border-gray-300 mb-8"/>
            <LiaCheckCircleSolid className="text-8xl text-green-500 mb-8" />
            <p>Ditt konto är nu verifierat!</p>
            <button 
                className="w-30 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" 
                onClick={() => window.location.href = "/login"}
                >
                Logga in här
            </button>
            
        </div>
    </div>
  )
};


export default verified;
