import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "./navbar.tsx"

function App() {
  return (
    <>
      <ToastContainer />
      <NavigationBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;


