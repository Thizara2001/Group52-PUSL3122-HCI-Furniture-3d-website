import * as THREE from "three";
import { Room } from "./room.ts";
import { Property } from "../property.ts";

export class LivingRoom extends Room {
  private width = 20;
  private height = 10;
  private depth = 20;
  private wallsColor = 0xdddddd;
  private floorColor = 0xcccccc;
  private ceilingColor = 0xeeeeee;
  public readonly refresh: () => void;

  constructor() {
    const name = "Living Room";

    const wallsMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
    });
    const floorMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
    });

    const materials = [
      wallsMaterial, // left
      wallsMaterial, // right
      ceilingMaterial, // top
      floorMaterial, // bottom
      wallsMaterial, // front
      wallsMaterial, // back
    ];

    const model = new THREE.Mesh(new THREE.BoxGeometry(), materials);
    model.name = name;

    super("livingRoom", name, model);

    this.refresh = () => {
      model.geometry.dispose();

      model.geometry = new THREE.BoxGeometry(
        this.width,
        this.height,
        this.depth,
      );

      wallsMaterial.color.setHex(this.wallsColor);
      floorMaterial.color.setHex(this.floorColor);
      ceilingMaterial.color.setHex(this.ceilingColor);
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
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          this.wallsColor = parseInt(color.replace("#", "0x"), 16);
        },
      },
      {
        name: "Floor Color",
        type: "color",
        get: () => `#${this.floorColor.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          this.floorColor = parseInt(color.replace("#", "0x"), 16);
        },
      },
      {
        name: "Ceiling Color",
        type: "color",
        get: () => `#${this.ceilingColor.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          this.ceilingColor = parseInt(color.replace("#", "0x"), 16);
        },
      },
      {
        name: "Width",
        type: "number",
        min: 10,
        max: 30,
        get: () => this.width,
        set: (width: unknown) => {
          if (typeof width !== "number") {
            console.error("Invalid width value");
            return;
          }
          this.width = width;
        },
      },
      {
        name: "Height",
        type: "number",
        min: 5,
        max: 15,
        get: () => this.height,
        set: (height: unknown) => {
          if (typeof height !== "number") {
            console.error("Invalid height value");
            return;
          }
          this.height = height;
        },
      },
      {
        name: "Depth",
        type: "number",
        min: 10,
        max: 30,
        get: () => this.depth,
        set: (depth: unknown) => {
          if (typeof depth !== "number") {
            console.error("Invalid depth value");
            return;
          }
          this.depth = depth;
        },
      },
    ];
  }

  public getFloorY(): number {
    return -this.height / 2;
  }

  public static fromData(dump: LivingRoomData): LivingRoom {
    const livingRoom = new LivingRoom();
    livingRoom.width = dump.width;
    livingRoom.height = dump.height;
    livingRoom.depth = dump.depth;
    livingRoom.wallsColor = dump.wallsColor;
    livingRoom.floorColor = dump.floorColor;
    livingRoom.ceilingColor = dump.ceilingColor;
    livingRoom.refresh();
    return livingRoom;
  }

  public dumpData(): LivingRoomData {
    return {
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      depth: this.depth,
      wallsColor: this.wallsColor,
      floorColor: this.floorColor,
      ceilingColor: this.ceilingColor,
    };
  }
}

export type LivingRoomData = {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  wallsColor: number;
  floorColor: number;
  ceilingColor: number;
};
