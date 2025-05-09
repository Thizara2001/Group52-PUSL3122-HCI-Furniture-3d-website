import * as THREE from "three";
import { Room } from "./room.ts";
import { Property } from "../property.ts";

export class OfficeRoom extends Room {
  private radius = 15;
  private height = 10;
  private wallColor = 0xbbbbbb;
  private floorColor = 0x999999;

  public readonly refresh: () => void;

  constructor() {
    const name = "Office Room";
    const group = new THREE.Group();
    super("officeRoom", name, group as unknown as THREE.Mesh);

    // Materials
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: this.wallColor,
      side: THREE.BackSide,
    });
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: this.floorColor,
      side: THREE.FrontSide,
    });

    // Components
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(), wallMaterial);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(), floorMaterial);

    wall.rotation.y = 0;
    floor.rotation.x = -Math.PI / 2;

    group.add(wall, floor);

    this.refresh = () => {
      // Wall
      wall.geometry.dispose();
      wall.geometry = new THREE.CylinderGeometry(
        this.radius,
        this.radius,
        this.height,
        64,
        1,
        true,
      );

      // Floor
      floor.geometry.dispose();
      floor.geometry = new THREE.CircleGeometry(this.radius, 64);
      floor.position.set(0, -this.height / 2, 0);

      // Set colors
      wallMaterial.color.setHex(this.wallColor);
      floorMaterial.color.setHex(this.floorColor);
    };

    this.refresh();
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Radius",
        type: "number",
        min: 5,
        max: 30,
        get: () => this.radius,
        set: (value: unknown) => {
          if (typeof value === "number") this.radius = value;
        },
      },
      {
        name: "Height",
        type: "number",
        min: 4,
        max: 20,
        get: () => this.height,
        set: (value: unknown) => {
          if (typeof value === "number") this.height = value;
        },
      },
      {
        name: "Wall Color",
        type: "color",
        get: () => `#${this.wallColor.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string")
            this.wallColor = parseInt(color.replace("#", "0x"), 16);
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
    ];
  }

  public getFloorY(): number {
    return -this.height / 2;
  }

  public static fromData(dump: OfficeRoomData): OfficeRoom {
    const room = new OfficeRoom();
    room.radius = dump.radius;
    room.height = dump.height;
    room.wallColor = dump.wallColor;
    room.floorColor = dump.floorColor;
    room.refresh();
    return room;
  }

  public dumpData(): OfficeRoomData {
    return {
      id: this.id,
      name: this.name,
      radius: this.radius,
      height: this.height,
      wallColor: this.wallColor,
      floorColor: this.floorColor,
    };
  }
}

export type OfficeRoomData = {
  id: string;
  name: string;
  radius: number;
  height: number;
  wallColor: number;
  floorColor: number;
};
