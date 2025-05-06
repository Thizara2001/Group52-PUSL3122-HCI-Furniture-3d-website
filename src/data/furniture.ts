import { Sofa } from "../models/furniture/sofa.ts";
import { Furniture } from "../models/furniture/furniture.ts";
import * as THREE from "three";

const sofa = new Sofa();

export const furniture: Furniture[] = [sofa];

export const createBackgroundFurniture = (): THREE.Mesh[] => {
  return furniture.map(item => item.getModel().clone());
};

export const getFurnitureById = (index: string): Furniture | undefined => {
  return furniture.find((item) => item.getId() === index.toString());
};
