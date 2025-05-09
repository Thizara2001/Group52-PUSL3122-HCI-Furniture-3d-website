import * as THREE from "three";
import { Room } from "./room.ts";
import { Property } from "../property.ts";

export class PenthouseRoom extends Room {
  private width = 40;
  private height = 20;
  private depth = 20;
  private wallsColor = 0xdddddd;
  private floorColor = 0xcccccc;
  private ceilingColor = 0xeeeeee;
  private glassTint = 0xea7faf;

  public readonly refresh: () => void;

  constructor() {
    const name = "Penthouse Room";

    const wallMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
    });
    const floorMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });

    const materials = [
      glassMaterial, // left wall (glass)
      wallMaterial, // right wall
      ceilingMaterial, // ceiling
      floorMaterial, // floor
      glassMaterial, // front wall (glass)
      wallMaterial, // back wall
    ];

    const model = new THREE.Mesh(new THREE.BoxGeometry(), materials);
    model.name = name;

    super("penthouseRoom", name, model);

    this.refresh = () => {
      model.geometry.dispose();
      model.geometry = new THREE.BoxGeometry(
        this.width,
        this.height,
        this.depth,
      );

      wallMaterial.color.setHex(this.wallsColor);
      floorMaterial.color.setHex(this.floorColor);
      ceilingMaterial.color.setHex(this.ceilingColor);
      glassMaterial.color.setHex(this.glassTint);
    };

    this.refresh();
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Walls Color",
        type: "color",
        get: () => `#${this.wallsColor.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string")
            this.wallsColor = parseInt(color.replace("#", "0x"), 16);
        },
      },
      {
        name: "Floor Color",
        type: "color",
        get: () => `#${this.floorColor.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string")
            this.floorColor = parseInt(color.replace("#", "0x"), 16);
        },
      },
      {
        name: "Ceiling Color",
        type: "color",
        get: () => `#${this.ceilingColor.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string")
            this.ceilingColor = parseInt(color.replace("#", "0x"), 16);
        },
      },
      {
        name: "Glass Tint",
        type: "color",
        get: () => `#${this.glassTint.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string")
            this.glassTint = parseInt(color.replace("#", "0x"), 16);
        },
      },
      {
        name: "Width",
        type: "number",
        min: 10,
        max: 60,
        get: () => this.width,
        set: (value: unknown) => {
          if (typeof value === "number") this.width = value;
        },
      },
      {
        name: "Height",
        type: "number",
        min: 5,
        max: 30,
        get: () => this.height,
        set: (value: unknown) => {
          if (typeof value === "number") this.height = value;
        },
      },
      {
        name: "Depth",
        type: "number",
        min: 10,
        max: 40,
        get: () => this.depth,
        set: (value: unknown) => {
          if (typeof value === "number") this.depth = value;
        },
      },
    ];
  }

  public getFloorY(): number {
    return -this.height / 2;
  }

  public static fromData(dump: PenthouseRoomData): PenthouseRoom {
    const room = new PenthouseRoom();
    room.width = dump.width;
    room.height = dump.height;
    room.depth = dump.depth;
    room.wallsColor = dump.wallsColor;
    room.floorColor = dump.floorColor;
    room.ceilingColor = dump.ceilingColor;
    room.glassTint = dump.glassTint;
    room.refresh();
    return room;
  }

  public dumpData(): PenthouseRoomData {
    return {
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      depth: this.depth,
      wallsColor: this.wallsColor,
      floorColor: this.floorColor,
      ceilingColor: this.ceilingColor,
      glassTint: this.glassTint,
    };
  }
}

export type PenthouseRoomData = {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  wallsColor: number;
  floorColor: number;
  ceilingColor: number;
  glassTint: number;
};
