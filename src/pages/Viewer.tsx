import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ThreeScene from "../ThreeScene";
import { getFurnitureById, furniture } from "../data/furniture";
import { rooms, getRoomById } from "../data/rooms";
import { Room } from "../models/rooms/room.ts";
import { Furniture } from "../models/furniture/furniture.ts";
import { Property } from "../models/property.ts";
import {
  createDesign,
  getCurrentUser,
  updateDesign,
  User,
} from "../services/api";
import {
  createDesignFromModels,
  createModelsFromDesign,
  updateDesignFromModels,
} from "../services/designService";

const Viewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if we're viewing an existing design
  const designId = location.state?.designId;
  const designName = location.state?.designName;
  const designData = location.state?.designData;
  // Convert the design data to models
  const { room: designRoom, furniture: designFurniture } = designData
    ? createModelsFromDesign(designData)
    : {};
  const isNewDesign = location.state?.isNewDesign;

  // For direct furniture viewing (legacy support)
  const itemId: string | null = location.state?.id;

  const [view, setView] = useState<"2d" | "3d">("3d");
  const [selectedFurniture, setSelectedFurniture] = useState<
    Furniture | undefined
  >(designFurniture || (itemId ? getFurnitureById(itemId) : undefined));
  const [selectedRoom, setSelectedRoom] = useState<Room>(
    designRoom || rooms[0],
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [roomProperties, setRoomProperties] = useState<Property[]>([]);
  const [designTitle, setDesignTitle] = useState(designName || "Untitled");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  useEffect(() => {
    if (selectedFurniture) {
      setProperties(selectedFurniture.getProperties());
    }
  }, [selectedFurniture]);

  useEffect(() => {
    if (selectedRoom) {
      setRoomProperties(selectedRoom.getProperties());
    }
  }, [selectedRoom]);

  const handleSaveDesign = async () => {
    setSaveError(null);
    setIsSaving(true);

    try {
      if (designId) {
        // Update existing design
        await updateDesign(designId, {
          name: designTitle,
          ...updateDesignFromModels(selectedRoom, selectedFurniture),
        });
      } else {
        // Create new design
        await createDesign(
          createDesignFromModels(designTitle, selectedRoom, selectedFurniture),
        );
      }

      // Navigate back to designs page
      navigate("/designs");
    } catch (err) {
      console.error("Error saving design:", err);
      setSaveError("Failed to save design. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold mr-4">
              {isNewDesign || designId ? (
                currentUser && currentUser.role === "designer" ? (
                  <input
                    type="text"
                    value={designTitle}
                    onChange={(e) => setDesignTitle(e.target.value)}
                    className="border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Design Title"
                  />
                ) : (
                  `Viewing '${designTitle}'`
                )
              ) : selectedFurniture ? (
                `Viewing ${selectedFurniture.getName()} in ${selectedRoom.getName()}`
              ) : (
                `Viewing ${selectedRoom.getName()}`
              )}
            </h1>

            {(isNewDesign || designId) &&
              currentUser &&
              currentUser.role === "designer" && (
                <button
                  type={"button"}
                  onClick={handleSaveDesign}
                  disabled={isSaving}
                  className={`ml-4 px-4 py-2 rounded ${
                    isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isSaving
                    ? "Saving..."
                    : designId
                      ? "Update Design"
                      : "Save Design"}
                </button>
              )}
          </div>

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

        {saveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {saveError}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeScene
              view={view}
              furniture={selectedFurniture}
              room={selectedRoom}
            />
          </div>

          <div className="w-64 ml-4 p-4 bg-white rounded-lg shadow overflow-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Room</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Room
                </label>
                <select
                  value={selectedRoom?.getId()}
                  onChange={(e) => {
                    const room = getRoomById(e.target.value);
                    if (room) setSelectedRoom(room);
                  }}
                  className="w-full p-2 rounded border border-gray-300"
                >
                  {rooms.map((room) => (
                    <option key={room.getId()} value={room.getId()}>
                      {room.getName()}
                    </option>
                  ))}
                </select>
              </div>

              {roomProperties.map((prop) => (
                <PropertyController
                  key={prop.name}
                  property={prop}
                  rerender={() => {
                    // Create a new array to trigger re-render
                    setRoomProperties([...roomProperties]);
                  }}
                />
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Furniture</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Furniture
                </label>
                <select
                  value={selectedFurniture?.getId() || "none"}
                  onChange={(e) => {
                    if (e.target.value === "none") {
                      setSelectedFurniture(undefined);
                    } else {
                      const furniture = getFurnitureById(e.target.value);
                      if (furniture) setSelectedFurniture(furniture);
                    }
                  }}
                  className="w-full p-2 rounded border border-gray-300"
                >
                  <option value="none">No Furniture</option>
                  {furniture.map((item) => (
                    <option key={item.getId()} value={item.getId()}>
                      {item.getName()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedFurniture && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {selectedFurniture.getName()}
                </h2>

                {properties.map((prop) => (
                  <PropertyController
                    key={prop.name}
                    property={prop}
                    rerender={() => {
                      // Create a new array to trigger re-render
                      setProperties([...properties]);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const PropertyController: React.FC<{
  property: Property;
  rerender: () => void;
}> = ({ property, rerender }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {property.name}
      </label>
      {property.type === "color" && (
        <input
          type="color"
          value={property.get() as string}
          onChange={(e) => {
            property.set(e.target.value);
            rerender();
          }}
          className="w-full h-8 rounded border border-gray-300"
        />
      )}
      {property.type === "number" && (
        <input
          type="number"
          value={property.get() as number}
          min={property.min as number}
          max={property.max as number}
          onChange={(e) => {
            property.set(parseFloat(e.target.value));
            rerender();
          }}
          className="w-full p-2 rounded border border-gray-300"
        />
      )}
    </div>
  );
};

export default Viewer;
