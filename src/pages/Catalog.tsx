import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { furniture } from "../data/furniture";

const Catalog: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">Furniture Catalog</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {furniture.map((item) => (
            <div
              key={item.getId()}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-4xl">{item.getName()}</span>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.getName()}</h2>
                <Link
                  to={`/viewer?item=${item.getId()}`}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View in 3D
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;
