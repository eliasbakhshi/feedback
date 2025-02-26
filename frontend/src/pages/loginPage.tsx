import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/api/userApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loginUser, { isLoading }] = useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            toast.error("Alla fält måste fyllas i!", { position: "top-right" });
            return;
        }
        try {
            const userData = { UserId: "1" , Role: "user" };
            await loginUser(userData).unwrap();
            toast.success("Välkommen!", { position: "top-right" });
            navigate("/user/account");
        } catch (error: any) {
            const errorMessage = error.originalStatus;
            switch (errorMessage) {
                case 401:
                    toast.error("Fel e-post eller lösenord!", { position: "top-right" });
                    break;
                default:
                    toast.error("Något gick fel!", { position: "top-right" });
            }
        }
    };

    return (
        <div
            className="flex justify-center items-center h-screen bg-gray-900 bg-cover bg-center"
            style={{ backgroundImage: "url('/src/images/login.png')" }}
        >
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-red-600 text-center mb-4">Logga in</h2>
                <form onSubmit={handleLogin} className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="E-post"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg p-2 mb-3 w-full focus:ring-2 focus:ring-red-400"
                    />
                    <label className="text-gray-700 font-medium mb-1">Lösenord</label>
                    <input
                        type="password"
                        placeholder="Lösenord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:ring-2 focus:ring-red-400"
                    />
                    <button
                        type="submit"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loggar in..." : "Logga in"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

