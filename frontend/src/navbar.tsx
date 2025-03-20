import { useState } from "react";
import { LiaChevronLeftSolid, LiaChevronRightSolid, LiaUser, LiaHomeSolid, LiaFolderPlusSolid, LiaSignOutAltSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import logo from "/TV_logo_symbol_rgb_rod.png";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {

    Cookies.remove("userId");
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div className={`h-screen text-gray-800 flex flex-col p-4 transition-all ${collapsed ? "w-20" : "w-60"} border-r border-gray-600`}>
      <img 
        src={logo} 
        alt="logo" 
        className={`transition-all duration-300 w-20 mb-4 p-2 rounded`} 
      />
      
      <button onClick={() => setCollapsed(!collapsed)} className="mb-4 p-2 rounded hover:bg-gray-300">
        {collapsed ? <LiaChevronRightSolid size={28} /> : <LiaChevronLeftSolid size={28} />}
      </button>

      <nav className="flex flex-col gap-6 flex-grow">
        <Link to="/" className="p-2 rounded hover:bg-gray-300 flex items-center gap-2">
          <LiaHomeSolid size={28} />
          {!collapsed && <p>Hem</p>}
        </Link>
        <Link to="/" className="p-2 rounded hover:bg-gray-300 flex items-center gap-2">
          <LiaFolderPlusSolid size={28} />
          {!collapsed && <p>Skapa Enkät</p>}
        </Link>
        <Link to="/account" className="p-2 rounded hover:bg-gray-300 flex items-center gap-2">
          <LiaUser size={28} />
          {!collapsed && <p>Konto</p>}
        </Link>
      </nav>
      <button onClick={handleLogout} className="p-2 rounded hover:bg-gray-300 flex items-center gap-2 mt-auto">
        <LiaSignOutAltSolid size={28} />
        {!collapsed && <p>Logga ut</p>}
      </button>
    </div>
  );
};

export default Sidebar;
