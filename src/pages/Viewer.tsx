import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ThreeScene from "../ThreeScene";
import { getFurnitureById } from "../data/furniture";
import { Property } from "../models/furniture/furniture.ts";

const Viewer: React.FC = () => {
  const location = useLocation();
  const itemId: string | null = location.state?.id;
  const [view, setView] = useState<"2d" | "3d">("3d");
  const [furniture] = useState(itemId ? getFurnitureById(itemId) : undefined);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (furniture) {
      setProperties(furniture.getProperties());
    }
  }, [furniture]);

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            {furniture
              ? `Viewing ${furniture.getName()}`
              : "3D Furniture Viewer"}
          </h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("2d")}
              className={`px-4 py-2 rounded ${
                view === "2d" ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              2D View
            </button>
            <button
              type="button"
              onClick={() => setView("3d")}
              className={`px-4 py-2 rounded ${
                view === "3d" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              3D View
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeScene view={view} furniture={furniture} />
          </div>

          {furniture && (
            <div className="w-64 ml-4 p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Properties</h2>

              {properties.map((prop) => (
                <div key={prop.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {prop.name}
                  </label>

                  {prop.type === "color" && (
                    <input
                      type="color"
                      value={prop.get() as string}
                      onChange={(e) => {
                        prop.set(e.target.value);
                      }}
                      className="w-full h-8 rounded border border-gray-300"
                    />
                  )}

                  {prop.type === "number" && (
                    <input
                      type="number"
                      value={prop.get() as number}
                      min={prop.min as number}
                      max={prop.max as number}
                      onChange={(e) => {
                        prop.set(parseFloat(e.target.value));
                        // Create a new array to trigger re-render
                        setProperties([...properties]);
                      }}
                      className="w-full p-2 rounded border border-gray-300"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Viewer;
