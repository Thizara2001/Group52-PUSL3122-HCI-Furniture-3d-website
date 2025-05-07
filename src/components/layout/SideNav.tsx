import React from "react";
import { NavLink } from "react-router-dom";

const SideNav: React.FC = () => {
  return (
    <nav className="w-64 bg-gray-100 h-full p-4">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `block p-2 rounded ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Catalog
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/viewer"
            className={({ isActive }) =>
              `block p-2 rounded ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            3D Viewer
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
