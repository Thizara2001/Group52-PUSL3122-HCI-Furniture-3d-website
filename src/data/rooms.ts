import { LivingRoom } from "../models/rooms/livingRoom.ts";
import { Room } from "../models/rooms/room.ts";
import { StudyRoom } from "../models/rooms/studyRoom.ts";
import { OfficeRoom } from "../models/rooms/officeRoom.ts";

const livingRoom = new LivingRoom();
const studyRoom = new StudyRoom();
const officeRoom = new OfficeRoom();

export const rooms: Room[] = [livingRoom, studyRoom, officeRoom];

export const getRoomById = (index: string): Room | undefined => {
  return rooms.find((item) => item.getId() === index.toString());
};
