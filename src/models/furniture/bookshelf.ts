import * as THREE from "three";
import { Furniture } from "./furniture.ts";
import { Property } from "../property.ts";

export class Bookshelf extends Furniture {
  private width = 6;
  private depth = 2;
  private compartmentHeight = 2;
  private compartments = 4;
  private readonly scale = 100;
  private color = 0x8b0000; // dark red
  public readonly refresh: (floorY: number) => void;

  constructor() {
    const shelf = new THREE.Group();
    super("bookshelf", "Bookshelf", shelf as unknown as THREE.Mesh);

    const material = new THREE.MeshStandardMaterial();
    const shelves: THREE.Mesh[] = [];

    // Outer frame
    const left = new THREE.Mesh(new THREE.BoxGeometry(), material);
    const right = new THREE.Mesh(new THREE.BoxGeometry(), material);
    const back = new THREE.Mesh(new THREE.BoxGeometry(), material);
    shelf.add(left, right, back);

    // Create shelves dynamically
    this.refresh = (floorY) => {
      const totalHeight = this.compartments * this.compartmentHeight;

      // Frame
      left.geometry.dispose();
      left.geometry = new THREE.BoxGeometry(0.3, totalHeight, this.depth);
      left.position.set(-this.width / 2 + 0.15, totalHeight / 2, 0);

      right.geometry.dispose();
      right.geometry = new THREE.BoxGeometry(0.3, totalHeight, this.depth);
      right.position.set(this.width / 2 - 0.15, totalHeight / 2, 0);

      back.geometry.dispose();
      back.geometry = new THREE.BoxGeometry(this.width, totalHeight, 0.1);
      back.position.set(0, totalHeight / 2, -this.depth / 2 + 0.05);

      material.color.setHex(this.color);

      // Clear old shelves
      shelves.forEach((s) => shelf.remove(s));
      shelves.length = 0;

      // Create new shelves
      for (let i = 0; i <= this.compartments; i++) {
        const y = i * this.compartmentHeight;
        const shelfMesh = new THREE.Mesh(
          new THREE.BoxGeometry(this.width - 0.3, 0.2, this.depth),
          material,
        );
        shelfMesh.position.set(0, y, 0);
        shelf.add(shelfMesh);
        shelves.push(shelfMesh);
      }

      shelf.position.setY(floorY);
    };

    this.refresh(0);
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Width (cm)",
        type: "number",
        get: () => this.width * this.scale,
        set: (value: unknown) => {
          if (typeof value === "number") this.width = value / this.scale;
        },
      },
      {
        name: "Depth (cm)",
        type: "number",
        get: () => this.depth * this.scale,
        set: (value: unknown) => {
          if (typeof value === "number") this.depth = value / this.scale;
        },
      },
      {
        name: "Compartments",
        type: "number",
        min: 1,
        get: () => this.compartments,
        set: (value: unknown) => {
          if (typeof value === "number" && value > 0) {
            this.compartments = Math.floor(value);
          }
        },
      },
      {
        name: "Compartment Height (cm)",
        type: "number",
        min: 1,
        get: () => this.compartmentHeight * this.scale,
        set: (value: unknown) => {
          if (typeof value === "number") {
            this.compartmentHeight = value / this.scale;
          }
        },
      },
      {
        name: "Color",
        type: "color",
        get: () => `#${this.color.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string") {
            this.color = parseInt(color.replace("#", "0x"), 16);
          }
        },
      },
    ];
  }

  public static fromData(dump: BookshelfData): Bookshelf {
    const shelf = new Bookshelf();
    shelf.width = dump.width / 100;
    shelf.depth = dump.depth / 100;
    shelf.compartments = dump.compartments;
    shelf.color = dump.color;
    shelf.model.position.fromArray(dump.position);
    shelf.refresh(0);
    return shelf;
  }

  public dumpData(): BookshelfData {
    return {
      id: this.id,
      name: this.name,
      position: this.model.position.toArray(),
      width: this.width * this.scale,
      depth: this.depth * this.scale,
      compartments: this.compartments,
      color: this.color,
    };
  }
}

export type BookshelfData = {
  id: string;
  name: string;
  position: number[];
  width: number;
  depth: number;
  compartments: number;
  color: number;
};
