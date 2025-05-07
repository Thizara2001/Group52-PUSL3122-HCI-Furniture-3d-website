import { LivingRoom } from "../models/rooms/livingRoom.ts";
import { Room } from "../models/rooms/room.ts";

const livingRoom = new LivingRoom();

export const rooms: Room[] = [livingRoom];

export const getRoomById = (index: string): Room | undefined => {
  return rooms.find((item) => item.getId() === index.toString());
};
