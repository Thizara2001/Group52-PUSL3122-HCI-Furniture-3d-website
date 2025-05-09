import { LivingRoom } from "../models/rooms/livingRoom.ts";
import { Room } from "../models/rooms/room.ts";
import { StudyRoom } from "../models/rooms/studyRoom.ts";
import { OfficeRoom } from "../models/rooms/officeRoom.ts";
import { PartyRoom } from "../models/rooms/partyRoom.ts";
import { PentHouseRoom } from "../models/rooms/pentHouseRoom.ts";

const livingRoom = new LivingRoom();
const studyRoom = new StudyRoom();
const officeRoom = new OfficeRoom();
const partyRoom = new PartyRoom();
const pentHouseRoom = new PentHouseRoom();

export const rooms: Room[] = [
  livingRoom,
  studyRoom,
  officeRoom,
  partyRoom,
  pentHouseRoom,
];

export const getRoomById = (index: string): Room | undefined => {
  return rooms.find((item) => item.getId() === index.toString());
};
