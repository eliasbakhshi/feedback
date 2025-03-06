import { useState } from "react";
import { LiaChevronLeftSolid, LiaChevronRightSolid, LiaUser, LiaFolderSolid , LiaFolderPlusSolid } from "react-icons/lia";
import {Link} from "react-router-dom";
import logo from "/TV_logo_symbol_rgb_rod.png";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen text-gray-800 flex flex-col p-4 transition-all ${collapsed ? "w-16" : "w-48"} border-r border-gray-600`}>
        <img 
            src={logo} 
            alt="logo" 
            className={`transition-all duration-300 w-16 mb-4 p-2 rounded`} 
        />
      <button onClick={() => setCollapsed(!collapsed)} className="mb-4 p-2 rounded hover:bg-gray-300">
        {collapsed ? <LiaChevronRightSolid /> : <LiaChevronLeftSolid /> }
      </button>

      <nav className="flex flex-col gap-4">
        <Link to="/" className="p-2 rounded hover:bg-gray-300 flex items-center gap-2">
          <LiaFolderSolid  />
        </Link>
        <Link to="/" className="p-2 rounded hover:bg-gray-300 flex items-center gap-2">
          <LiaFolderPlusSolid  />
        </Link>
        <Link to="/account" className="p-2 rounded hover:bg-gray-300 flex items-center gap-2">
          <LiaUser />
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
