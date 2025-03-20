import { LiaMailBulkSolid } from "react-icons/lia";
const verify = () => {

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
        <div className="w-200 bg-white p-4 mt-8 rounded-lg mt-4 jsutify-center items-center flex flex-col shadow-md">
        <img
          src="/TV_logo_Horisontal_rod_RGB.png"
          alt="logo"
          className="w-80 mx-auto mb-8"
        />
        <hr className="w-full mt-2 border border-gray-300 mb-8"/>
            <LiaMailBulkSolid className="text-6xl text-gray-500 mb-4" />
            <p>Vi har skickat ett mail till din e-postadress.</p>
            <p>Klicka på länken i mailet för att verifiera ditt konto.</p>
        </div>
    </div>
  )
};


export default verify;
