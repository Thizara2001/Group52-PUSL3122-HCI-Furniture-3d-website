import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { logout } from "../../services/api";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in by trying to access a protected endpoint
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/getUserDesigns`,
      {
        credentials: "include",
      },
    )
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold">Future Furniture</span>
      </Link>

      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/catalog" className="hover:text-blue-300">
              Catalog
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/designs" className="hover:text-blue-300">
                  My Designs
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="hover:text-blue-300"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-300">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
