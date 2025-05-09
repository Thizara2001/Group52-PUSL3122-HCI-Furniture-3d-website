import * as THREE from "three";
import { Furniture } from "./furniture.ts";
import { Property } from "../property.ts";

export class Chair extends Furniture {
  private width = 4;
  private depth = 3;
  private height = 6;
  private readonly scale = 100;
  private color = 0x654321;

  public readonly refresh: (floorY: number) => void;

  constructor() {
    const chairGroup = new THREE.Group();
    super("chair", "Chair", chairGroup as unknown as THREE.Mesh);

    const material = new THREE.MeshStandardMaterial({ color: this.color });

    // Components
    const seat = new THREE.Mesh(new THREE.BoxGeometry(), material);
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(), material);
    const legs: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(), material);
      chairGroup.add(leg);
      legs.push(leg);
    }

    chairGroup.add(seat, backrest);

    this.refresh = (floorY: number) => {
      const seatHeight = 0.5;
      const backrestHeight = 3;
      const legHeight = this.height - seatHeight - backrestHeight;

      // Seat
      seat.geometry.dispose();
      seat.geometry = new THREE.BoxGeometry(this.width, seatHeight, this.depth);
      seat.position.set(0, legHeight, 0);

      // Backrest
      backrest.geometry.dispose();
      backrest.geometry = new THREE.BoxGeometry(
        this.width,
        backrestHeight,
        0.5,
      );
      backrest.position.set(
        0,
        legHeight + backrestHeight / 2,
        -this.depth / 2 + 0.25,
      );

      // Legs
      const legWidth = 0.3;
      const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legWidth);

      const offsets = [
        [
          this.width / 2 - legWidth / 2,
          legHeight / 2,
          this.depth / 2 - legWidth / 2,
        ], // front-right
        [
          -this.width / 2 + legWidth / 2,
          legHeight / 2,
          this.depth / 2 - legWidth / 2,
        ], // front-left
        [
          this.width / 2 - legWidth / 2,
          legHeight / 2,
          -this.depth / 2 + legWidth / 2,
        ], // back-right
        [
          -this.width / 2 + legWidth / 2,
          legHeight / 2,
          -this.depth / 2 + legWidth / 2,
        ], // back-left
      ];

      legs.forEach((leg, i) => {
        leg.geometry.dispose();
        leg.geometry = legGeometry;
        leg.position.set(offsets[i][0], offsets[i][1], offsets[i][2]);
      });

      material.color.setHex(this.color);
      chairGroup.position.setY(floorY);
    };

    this.refresh(0);
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Width (cm)",
        type: "number",
        get: () => this.width * this.scale,
        set: (val: unknown) => {
          if (typeof val === "number") this.width = val / this.scale;
        },
      },
      {
        name: "Depth (cm)",
        type: "number",
        get: () => this.depth * this.scale,
        set: (val: unknown) => {
          if (typeof val === "number") this.depth = val / this.scale;
        },
      },
      {
        name: "Height (cm)",
        type: "number",
        get: () => this.height * this.scale,
        set: (val: unknown) => {
          if (typeof val === "number") this.height = val / this.scale;
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

  public static fromData(dump: ChairData): Chair {
    const chair = new Chair();
    chair.width = dump.width / 100;
    chair.depth = dump.depth / 100;
    chair.height = dump.height / 100;
    chair.color = dump.color;
    chair.model.position.fromArray(dump.position);
    chair.refresh(0);
    return chair;
  }

  public dumpData(): ChairData {
    return {
      id: this.id,
      name: this.name,
      position: this.model.position.toArray(),
      width: this.width * this.scale,
      depth: this.depth * this.scale,
      height: this.height * this.scale,
      color: this.color,
    };
  }
}

export type ChairData = {
  id: string;
  name: string;
  position: number[];
  width: number;
  depth: number;
  height: number;
  color: number;
};
