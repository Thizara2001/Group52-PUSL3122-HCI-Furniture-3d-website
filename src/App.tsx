import React from "react";
import logo from "./assets/logo.svg";

const App: React.FC = () => {
  return (
    <div className={"flex flex-col min-h-screen"}>
      <header
        className={
          "flex justify-between items-center p-4 bg-gray-800 text-white"
        }
      >
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold">Future Furniture</span>
        </div>
      </header>
      <main
        className={
          "flex flex-col items-center justify-center flex-1 bg-gray-100"
        }
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to Future Furniture
          </h2>
          <p className="text-lg mb-4">
            Your one-stop shop for modern furniture solutions.
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            type={"button"}
          >
            Shop Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
