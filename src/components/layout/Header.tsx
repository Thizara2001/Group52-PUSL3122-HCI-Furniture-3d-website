import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold">Future Furniture</span>
      </Link>
    </header>
  );
};

export default Header;
