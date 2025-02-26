import { userState } from "react"; // This is a hook that allows us to store the user's state
import { useNavigate } from "react-router-dom"; // This is a hook that allows us to navigate to different pages
import { loginUser } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux"; // This is a hook that allows us to dispatch actions



// A fake user object that we will use to simulate a user logging in
/*const fakeUser = {
  email: "test@example.com", // The user's email
  password: "password", // The user's password
};*/

const LoginPage = () => {
    const [email, setEmail] = useState(""); // The user's email
    const [password, setPassword] = useState(""); // The user's password
    const dispatch = useDispatch(); // The dispatch function that we will use to dispatch actions
    const navigate = useNavigate(); // The navigate function that we will use to navigate to different pages
    
    const {loading, error } = useSelector((state) => state.auth);

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }))
            .unwrap()
            .then(() => {
                navigate("/"); // Skicka användaren till startsidan efter inloggning
            })
            .catch((err) => {
                console.error("Login failed:", err);
            });
    };



        // Simulate a login request
        /*if (email === fakeUser.email && password === fakeUser.password) {
            localStorage.setItem("token", "fakeToken"); // Save the token to local storage
            navigate("/"); // Navigate to the home page
        } else {
            setError("Fel e-post eller lösenord"); // Set the error message
        }
    };*/

    return (
        <div> {/* The login form */}
            <h2>Logga in</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="E-post"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Logga in</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LoginPage;