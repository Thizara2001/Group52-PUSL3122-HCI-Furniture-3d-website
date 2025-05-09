import { Room } from "../models/rooms/room";
import { Furniture } from "../models/furniture/furniture";
import { LivingRoom, LivingRoomData } from "../models/rooms/livingRoom";
import { Sofa, SofaData } from "../models/furniture/sofa";
import { DesignCreate, DesignUpdate, DesignData } from "./api";

/**
 * Converts a room and furniture to a design for the API
 */
export const createDesignFromModels = (
  name: string,
  room: Room,
  furniture?: Furniture,
): DesignCreate => {
  const designData: DesignData = {
    room: {
      type: room.getId(),
      data: room.dumpData(),
    },
  };

  if (furniture) {
    designData.furniture = {
      type: furniture.getId(),
      data: furniture.dumpData(),
    };
  }

  return {
    name,
    data: designData,
  };
};

/**
 * Updates a design with new room and furniture data
 */
export const updateDesignFromModels = (
  room: Room,
  furniture?: Furniture,
): DesignUpdate => {
  const designData: DesignData = {
    room: {
      type: room.getId(),
      data: room.dumpData(),
    },
  };

  if (furniture) {
    designData.furniture = {
      type: furniture.getId(),
      data: furniture.dumpData(),
    };
  }

  return {
    data: designData,
  };
};

/**
 * Converts a design from the API to room and furniture models
 */
export const createModelsFromDesign = (
  designData: DesignData,
): { room: Room; furniture?: Furniture } => {
  let room: Room;
  let furniture: Furniture | undefined;

  // Create room based on type
  switch (designData.room.type) {
    case "livingRoom":
      room = LivingRoom.fromData(designData.room.data as LivingRoomData);
      break;
    default:
      throw new Error(`Unknown room type: ${designData.room.type}`);
  }

  // Create furniture if it exists
  if (designData.furniture) {
    switch (designData.furniture.type) {
      case "sofa":
        furniture = Sofa.fromData(designData.furniture.data as SofaData);
        break;
      default:
        throw new Error(`Unknown furniture type: ${designData.furniture.type}`);
    }
  }

  return { room, furniture };
};
