import { Room } from "../models/rooms/room";
import { Furniture } from "../models/furniture/furniture";
import { LivingRoom, LivingRoomData } from "../models/rooms/livingRoom";
import { Sofa, SofaData } from "../models/furniture/sofa";
import { DesignCreate, DesignUpdate, DesignData } from "./api";
import { OfficeRoom, OfficeRoomData } from "../models/rooms/officeRoom.ts";
import { StudyRoom, StudyRoomData } from "../models/rooms/studyRoom.ts";
import {
  PentHouseRoom,
  PentHouseRoomData,
} from "../models/rooms/pentHouseRoom.ts";
import { PartyRoom, TShapedRoomData } from "../models/rooms/partyRoom.ts";
import { Chair, ChairData } from "../models/furniture/chair.ts";
import { Bookshelf, BookshelfData } from "../models/furniture/bookshelf.ts";
import { Table, TableData } from "../models/furniture/table.ts";
import { Lamp, LampData } from "../models/furniture/lamp.ts";
import { Rug, RugData } from "../models/furniture/rug.ts";

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
    case "officeRoom":
      room = OfficeRoom.fromData(designData.room.data as OfficeRoomData);
      break;
    case "studyRoom":
      room = StudyRoom.fromData(designData.room.data as StudyRoomData);
      break;
    case "pentHouseRoom":
      room = PentHouseRoom.fromData(designData.room.data as PentHouseRoomData);
      break;
    case "partyRoom":
      room = PartyRoom.fromData(designData.room.data as TShapedRoomData);
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
      case "bookshelf":
        furniture = Bookshelf.fromData(
          designData.furniture.data as BookshelfData,
        );
        break;
      case "chair":
        furniture = Chair.fromData(designData.furniture.data as ChairData);
        break;
      case "table":
        furniture = Table.fromData(designData.furniture.data as TableData);
        break;
      case "lamp":
        furniture = Lamp.fromData(designData.furniture.data as LampData);
        break;
      case "rug":
        furniture = Rug.fromData(designData.furniture.data as RugData);
        break;
      default:
        throw new Error(`Unknown furniture type: ${designData.furniture.type}`);
    }
  }

  return { room, furniture };
};
