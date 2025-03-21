import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGetAccountInfoQuery, useUpdatePasswordMutation, useUpdateFirstNameMutation, useUpdateLastNameMutation } from "../../store/api/userApiSlice";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie"; 

const Account = () => {
  const userId = Cookies.get("userId");

  const { data: userData } = useGetAccountInfoQuery(Number(userId)); {/* använd userId från session storage */}
  const [updatePassword] = useUpdatePasswordMutation();
  const [updateFirstName] = useUpdateFirstNameMutation();
  const [updateLastName] = useUpdateLastNameMutation();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (userData && userData.length > 0) {
      const user = userData[0];
      setfirstName(user.firstname);
      setlastName(user.lastname);
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
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("Fältet måste fyllas i!", { position: "top-right" });
      } else {
        if (userId) {
          await updateFirstName({ UserId: userId, newFirstName: firstName });
          await updateLastName({ UserId: userId, newLastName: lastName });
        } else {
          toast.error("Något gick fel!", { position: "top-right" });
        }
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
      if (userId) {
        await updatePassword({ UserId: userId, CurrentPassword: currentPassword, NewPassword: newPassword }).unwrap();
      } else {
        toast.error("Något gick fel!", { position: "top-right" });
      }
      toast.success("Lösenord uppdaterad!", { position: "top-right" });
      setIsEditingPassword(false);
    } catch (error: any) {
      console.log("error", error);
      const statusCode = error?.originalStatus;
      switch (statusCode) {
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
      <div className="w-full max-w-md">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Kontoinställningar</h1>
          <div className="flex items-center space-x-4 mb-4">
            <img src="/TV_logo_Master_Symbol_rgb.png" alt="logo" className="w-20 rounded-full"/>
            <div>
              <p className="text-3xl font-medium text-gray-600">{`${firstName} ${lastName}`}</p>
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
                    alt="edit name" 
                    className="w-5 cursor-pointer" 
                    onClick={() => setIsEditingName(!isEditingName)}
                  />
                </div>
                {isEditingName ? (
                  <>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setfirstName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      aria-label="Förnamn"
                    />
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setlastName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      aria-label="Efternamn"
                    />
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-600">{`${firstName} ${lastName}`}</p>
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
                    alt="edit password" 
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
                    aria-label="Nuvarande lösenord"
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
                      aria-label="Nytt lösenord"
                    />
                  </div>
                  <div className="mt-2 mb-2">
                    <p className="text-lg font-medium text-gray-600 mt-2">Bekräfta lösenord</p>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      aria-label="Bekräfta lösenord"
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