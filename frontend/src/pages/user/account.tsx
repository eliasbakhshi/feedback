import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetAccountInfoQuery, useUpdatePasswordMutation, useUpdateNameMutation } from "../../store/api/userApiSlice";
import "react-toastify/dist/ReactToastify.css";

const Account = () => {
  const navigate = useNavigate();

  const { data: userData } = useGetAccountInfoQuery(1); {/* hårdkodad user id */}
  const [updateName] = useUpdateNameMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userData && userData.length > 0) {
      const user = userData[0];
      setFullname(user.fullname);
      setEmail(user.email);
    }
  }, [userData]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleSaveName = async () => {
    try {
      if (!fullname.trim()) {
        toast.error("Fältet måste fyllas i!", { position: "top-right" });
      } else {
        await updateName({ UserId: "1", NewName: fullname });
        setIsEditingName(false);
        toast.success("Namn uppdaterad!", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Något gick fel!", { position: "top-right" });
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Alla fält måste fyllas i!", { position: "top-right" });
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Lösenordet måste vara minst 6 tecken långt!", { position: "top-right" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Lösenorden matchar inte!", { position: "top-right" });
      return;
    }

    try {
      await updatePassword({ UserId: "1", CurrentPassword: currentPassword, NewPassword: newPassword }).unwrap();
    } catch (error: any) {
      const statusCode = error?.originalStatus;
      switch (statusCode) {
        case 200:
          toast.success("Lösenord uppdaterad!", { position: "top-right" });
          setIsEditingPassword(false);
          break;
        case 400:
          toast.error("Ditt nya lösenord får inte vara samma som ditt gamla!", { position: "top-right" });
          break;
        case 401:
          toast.error("Otillåtet! Kontrollera ditt nuvarande lösenord.", { position: "top-right" });
          break;
        default:
          toast.error("Något gick fel!", { position: "top-right" });
          break;
      }
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
      <div className="w-full max-w-md">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Konto inställningar</h1>
          <div className="flex items-center space-x-4 mb-4">
            <img src="/TV_logo_Master_Symbol_rgb.png" alt="logo" className="w-20 rounded-full"/>
            <div>
              <p className="text-3xl font-medium text-gray-600">{fullname}</p>
              <hr className="w-full mt-2 border border-gray-300"/>
            </div>
          </div>
          <div className="p-4 rounded-lg space-y-2 border border-gray-300 relative">
            <div>
              <div className="mt-2 mb-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-600">Namn</p>
                  <img 
                    src="/pen.png" 
                    alt="edit" 
                    className="w-5 cursor-pointer" 
                    onClick={() => setIsEditingName(!isEditingName)}
                  />
                </div>
                {isEditingName ? (
                  <input 
                    type="text" 
                    value={fullname} 
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-600">{fullname}</p>
                )}
              </div>
              <div className="mt-2 mb-2">
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-600">{email}</p>
              </div>

              {/* Nuvarande lösenord */}
              <div className="mt-2 mb-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-600 mt-2">Nuvarande lösenord</p>
                  <img 
                    src="/pen.png" 
                    alt="edit" 
                    className="w-5 cursor-pointer" 
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                  />
                </div>
                {isEditingPassword ? (
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-600 mt-2">**********</p>
                )}
              </div>

              {/* Nytt lösenord */}
              {isEditingPassword && (
                <>
                  <div className="mt-2 mb-2">
                    <p className="text-lg font-medium text-gray-600 mt-2">Nytt lösenord</p>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="mt-2 mb-2">
                    <p className="text-lg font-medium text-gray-600 mt-2">Bekräfta lösenord</p>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Spara namn */}
          {isEditingName && (
            <div className="flex justify-end">
              <button 
                className="w-20 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" 
                onClick={handleSaveName}
              >
                Spara
              </button>
            </div>
          )}
          {/* Spara lösenord */}
          {isEditingPassword && (
            <div className="flex justify-end">
              <button 
                className="w-20 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300" 
                onClick={handleSavePassword}
              >
                Spara
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;