import { Sofa } from "../models/furniture/sofa.ts";
import { Furniture } from "../models/furniture/furniture.ts";
import * as THREE from "three";
import { Table } from "../models/furniture/table.ts";
import { Bookshelf } from "../models/furniture/bookshelf.ts";
import { Lamp } from "../models/furniture/lamp.ts";
import { Chair } from "../models/furniture/chair.ts";

const sofa = new Sofa();
const table = new Table();
const bookshelf = new Bookshelf();
const lamp = new Lamp();
const chair = new Chair();

export const furniture: Furniture[] = [sofa, table, bookshelf, lamp, chair];

export const createBackgroundFurniture = (): THREE.Mesh[] => {
  return furniture.map((item) => item.getModel().clone());
};

export const getFurnitureById = (index: string): Furniture | undefined => {
  return furniture.find((item) => item.getId() === index.toString());
};
