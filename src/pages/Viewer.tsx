import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ThreeScene from "../ThreeScene";
import { getFurnitureById } from "../data/furniture";
import { rooms, getRoomById } from "../data/rooms";
import { Room } from "../models/rooms/room.ts";
import { Property } from "../models/property.ts";

const Viewer: React.FC = () => {
  const location = useLocation();
  const itemId: string | null = location.state?.id;
  const [view, setView] = useState<"2d" | "3d">("3d");
  const [furniture] = useState(itemId ? getFurnitureById(itemId) : undefined);
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [roomProperties, setRoomProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (furniture) {
      setProperties(furniture.getProperties());
    }
  }, [furniture]);

  useEffect(() => {
    if (selectedRoom) {
      setRoomProperties(selectedRoom.getProperties());
    }
  }, [selectedRoom]);

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
            <ThreeScene view={view} furniture={furniture} room={selectedRoom} />
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

            {furniture && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {furniture.getName()}
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
