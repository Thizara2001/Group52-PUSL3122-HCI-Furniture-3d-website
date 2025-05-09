import * as THREE from "three";
import { Furniture } from "./furniture.ts";
import { Property } from "../property.ts";

export class Rug extends Furniture {
  private width = 10; // in meters
  private depth = 6;
  private readonly scale = 100;
  private color = 0xb5651d; // brownish

  public readonly refresh: (floorY: number) => void;

  constructor() {
    const rug = new THREE.Group();
    super("rug", "Rug", rug as unknown as THREE.Mesh);

    const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });

    const rugMesh = new THREE.Mesh(new THREE.BoxGeometry(), material);

    rug.add(rugMesh);

    this.refresh = (floorY: number) => {
      rugMesh.geometry.dispose();
      rugMesh.geometry = new THREE.BoxGeometry(this.width, 0.01, this.depth);
      rugMesh.position.set(0, 0, 0);

      material.color.setHex(this.color);
      rug.position.setY(floorY);
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
        name: "Color",
        type: "color",
        get: () => `#${this.color.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string")
            this.color = parseInt(color.replace("#", "0x"), 16);
        },
      },
    ];
  }

  public static fromData(dump: RugData): Rug {
    const rug = new Rug();
    rug.width = dump.width / 100;
    rug.depth = dump.depth / 100;
    rug.color = dump.color;
    rug.model.position.fromArray(dump.position);
    rug.refresh(0);
    return rug;
  }

  public dumpData(): RugData {
    return {
      id: this.id,
      name: this.name,
      position: this.model.position.toArray(),
      width: this.width * this.scale,
      depth: this.depth * this.scale,
      color: this.color,
    };
  }
}

export type RugData = {
  id: string;
  name: string;
  position: number[];
  width: number;
  depth: number;
  color: number;
};
