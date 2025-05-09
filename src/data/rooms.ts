import { LivingRoom } from "../models/rooms/livingRoom.ts";
import { Room } from "../models/rooms/room.ts";
import { StudyRoom } from "../models/rooms/studyRoom.ts";

const livingRoom = new LivingRoom();
const studyRoom = new StudyRoom();

export const rooms: Room[] = [livingRoom, studyRoom];

export const getRoomById = (index: string): Room | undefined => {
  return rooms.find((item) => item.getId() === index.toString());
};
