import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import LandingBackground from "../components/LandingBackground";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 relative overflow-hidden">
        {/* Background with revolving furniture */}
        <LandingBackground />

        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-70"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            Transform Your Space with Future Furniture
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl">
            Experience furniture in 3D before you buy. Design your perfect space
            with our interactive tools.
          </p>
          <Link
            to="/catalog"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl font-semibold transition-colors"
          >
            Explore Our Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
