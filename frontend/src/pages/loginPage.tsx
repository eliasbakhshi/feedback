import React, { useState } from "react"; // This is a hook that allows us to store the user's state
import { useNavigate } from "react-router-dom"; // This is a hook that allows us to navigate to different pages

// A fake user object that we will use to simulate a user logging in
const fakeUser = {
  email: "test@example.com", // The user's email
  password: "password", // The user's password
};

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState(""); // The user's email
    const [password, setPassword] = useState(""); // The user's password
    const [error, setError] = useState(""); // The error message to display to the user
    const navigate = useNavigate(); // The navigate function that we will use to navigate to different pages

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear the error message

        // Simulate a login request
        if (email === fakeUser.email && password === fakeUser.password) {
            localStorage.setItem("token", "fakeToken"); // Save the token to local storage
            navigate("/"); // Navigate to the home page
        } else {
            setError("Fel e-post eller lösenord"); // Set the error message
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
                        >
                            Logga in
                        </button>
                        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;