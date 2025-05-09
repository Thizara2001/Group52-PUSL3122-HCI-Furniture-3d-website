import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { logout, getCurrentUser, User } from "../../services/api";

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Fetch current user data from /me endpoint
  useEffect(() => {
    getCurrentUser()
      .then((userData) => {
        if (userData) {
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setCurrentUser(null);
      });
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      setCurrentUser(null);
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
          {currentUser ? (
            <>
              <li>
                <Link to="/designs" className="hover:text-blue-300">
                  Designs
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
