import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./navbar";

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen w-full">
        {!hideSidebar && <Sidebar />}
        <main className={hideSidebar ? "w-full" : ""}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;