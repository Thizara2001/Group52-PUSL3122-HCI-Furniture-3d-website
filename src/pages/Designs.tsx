import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import {
  getAllDesigns,
  getUserDesigns,
  deleteDesign,
  Design,
} from "../services/api";

const Designs: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "my">("all");
  const navigate = useNavigate();

  const fetchDesigns = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const fetchedDesigns =
      viewMode === "all" ? getAllDesigns() : getUserDesigns();
    fetchedDesigns
      .then((res) => {
        setDesigns(res);
      })
      .catch((err) => {
        console.error("Error fetching designs:", err);
        if (err.response?.status === 403) {
          setError("You need to be a designer to view your designs.");
        } else {
          setError("Failed to load designs. Please try again later.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [viewMode]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns, viewMode]);

  const handleViewDesign = (design: Design) => {
    try {
      // Navigate to the viewer with the models
      navigate("/viewer", {
        state: {
          designId: design.id,
          designName: design.name,
          designData: design.data,
        },
      });
    } catch (err) {
      console.error("Error loading design:", err);
      setError("Failed to load design. It may contain unsupported elements.");
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    if (!window.confirm("Are you sure you want to delete this design?")) {
      return;
    }

    try {
      await deleteDesign(designId);
      // Refresh the designs list
      fetchDesigns();
    } catch (err) {
      console.error("Error deleting design:", err);
      setError("Failed to delete design. Please try again.");
    }
  };

  const handleCreateNewDesign = () => {
    navigate("/viewer", { state: { isNewDesign: true } });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Furniture Designs</h1>
          <button
            type={"button"}
            onClick={handleCreateNewDesign}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Create New Design
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              type={"button"}
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded ${
                viewMode === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              All Designs
            </button>
            <button
              type={"button"}
              onClick={() => setViewMode("my")}
              className={`px-4 py-2 rounded ${
                viewMode === "my" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              My Designs
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading designs...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p className="text-gray-600">No designs found.</p>
            {viewMode === "my" && (
              <p className="mt-2">
                <button
                  type={"button"}
                  onClick={handleCreateNewDesign}
                  className="text-blue-600 hover:underline"
                >
                  Create your first design
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{design.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Owner ID: {design.ownerId}
                  </p>
                  <div className="flex justify-between">
                    <button
                      type={"button"}
                      onClick={() => handleViewDesign(design)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm"
                    >
                      View
                    </button>
                    {viewMode === "my" && (
                      <button
                        type={"button"}
                        onClick={() => handleDeleteDesign(design.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Designs;
