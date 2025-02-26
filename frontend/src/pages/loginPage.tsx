import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../store/api/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setUser } from "../store/authSlice";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>(""); // Typad state
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>(); // Typad dispatch
    const navigate = useNavigate();

    const state = useSelector((state: RootState) => state);
    console.log("Redux state:", state);
    console.table(state);
    // Hämta status från Redux store
    // const { loading, error } = useSelector((state: RootState) => state.auth);

    const { userId, role, loading, error } = useSelector((state: RootState) => state.auth) || {
        userId: null,
        role: null,
        loading: false,
        error: null
    };


    //Använd API-hook för inloggning
    const [loginUser, { isLoading }] = useLoginUserMutation();


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const userData = await loginUser({ email, password }).unwrap();
            dispatch(setUser(userData)); //Spara användaren i Redux
            navigate("/"); // Omdirigera vid lyckad inloggning
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/images/login.png')" }}>
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
                            disabled={loading} // Inaktivera knapp vid laddning
                        >
                            {loading ? "Loggar in..." : "Logga in"}
                        </button>
                        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;