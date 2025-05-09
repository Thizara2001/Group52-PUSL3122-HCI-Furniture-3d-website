import * as THREE from "three";
import { Room } from "./room.ts";
import { Property } from "../property.ts";

export class StudyRoom extends Room {
  private mainWidth = 15;
  private mainDepth = 20;
  private sideWidth = 10;
  private sideDepth = 10;
  private height = 10;

  private wallsColor = 0xe0e0e0;
  private floorColor = 0xd0c8c0;
  private ceilingColor = 0xf5f5f5;

  public readonly refresh: () => void;

  constructor() {
    const name = "Study Room";

    const group = new THREE.Group();
    group.name = name;

    super("studyRoom", name, group as unknown as THREE.Mesh);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: this.wallsColor,
      side: THREE.BackSide,
    });
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: this.floorColor,
      side: THREE.BackSide,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: this.ceilingColor,
      side: THREE.BackSide,
    });
    // Transparent material for connecting walls
    const transparentMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });

    const mainRoomMaterial = [
      transparentMaterial, // left - connecting wall with sideRoom
      wallMaterial, // right
      ceilingMaterial, // top
      floorMaterial, // bottom
      wallMaterial, // front
      wallMaterial, // back
    ];

    const sideRoomMaterial = [
      wallMaterial, // left
      transparentMaterial, // right - connecting wall with mainRoom
      ceilingMaterial, // top
      floorMaterial, // bottom
      wallMaterial, // front
      wallMaterial, // back
    ];

    const mainRoom = new THREE.Mesh(new THREE.BoxGeometry(), mainRoomMaterial);
    const sideRoom = new THREE.Mesh(new THREE.BoxGeometry(), sideRoomMaterial);
    const halfWall = new THREE.Mesh(new THREE.PlaneGeometry(), wallMaterial);

    group.add(mainRoom, sideRoom, halfWall);

    this.refresh = () => {
      mainRoom.geometry.dispose();
      sideRoom.geometry.dispose();
      halfWall.geometry.dispose();

      // Main box
      mainRoom.geometry = new THREE.BoxGeometry(
        this.mainWidth,
        this.height,
        this.mainDepth,
      );
      mainRoom.position.set(0, 0, 0);

      // Side box
      sideRoom.geometry = new THREE.BoxGeometry(
        this.sideWidth,
        this.height,
        this.sideDepth,
      );
      sideRoom.position.set(
        this.mainWidth / 2 + this.sideWidth / 2,
        0,
        this.mainDepth / 2 - this.sideDepth / 2,
      );

      // Half wall
      halfWall.geometry = new THREE.PlaneGeometry(
        this.mainDepth - this.sideWidth,
        this.height,
      );
      halfWall.rotation.y = Math.PI / 2;
      halfWall.position.set(
        this.mainWidth / 2,
        0,
        -this.mainDepth / 2 + this.sideDepth / 2,
      );

      // Apply colors
      wallMaterial.color.setHex(this.wallsColor);
      floorMaterial.color.setHex(this.floorColor);
      ceilingMaterial.color.setHex(this.ceilingColor);
    };

    this.refresh();
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Main Width",
        type: "number",
        min: 8,
        max: 20,
        get: () => this.mainWidth,
        set: (value: unknown) => {
          if (typeof value === "number") this.mainWidth = value;
        },
      },
      {
        name: "Main Depth",
        type: "number",
        min: 8,
        max: 20,
        get: () => this.mainDepth,
        set: (value: unknown) => {
          if (typeof value === "number") this.mainDepth = value;
        },
      },
      {
        name: "Side Width",
        type: "number",
        min: 4,
        max: 10,
        get: () => this.sideWidth,
        set: (value: unknown) => {
          if (typeof value === "number") this.sideWidth = value;
        },
      },
      {
        name: "Side Depth",
        type: "number",
        min: 4,
        max: 10,
        get: () => this.sideDepth,
        set: (value: unknown) => {
          if (typeof value === "number") this.sideDepth = value;
        },
      },
      {
        name: "Height",
        type: "number",
        min: 5,
        max: 15,
        get: () => this.height,
        set: (value: unknown) => {
          if (typeof value === "number") this.height = value;
        },
      },
      {
        name: "Wall Color",
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
    ];
  }

  public getFloorY(): number {
    return -this.height / 2;
  }

  public static fromData(dump: StudyRoomData): StudyRoom {
    const room = new StudyRoom();
    room.mainWidth = dump.mainWidth;
    room.mainDepth = dump.mainDepth;
    room.sideWidth = dump.sideWidth;
    room.sideDepth = dump.sideDepth;
    room.height = dump.height;
    room.wallsColor = dump.wallsColor;
    room.floorColor = dump.floorColor;
    room.ceilingColor = dump.ceilingColor;
    room.refresh();
    return room;
  }

  public dumpData(): StudyRoomData {
    return {
      id: this.id,
      name: this.name,
      mainWidth: this.mainWidth,
      mainDepth: this.mainDepth,
      sideWidth: this.sideWidth,
      sideDepth: this.sideDepth,
      height: this.height,
      wallsColor: this.wallsColor,
      floorColor: this.floorColor,
      ceilingColor: this.ceilingColor,
    };
  }
}

export type StudyRoomData = {
  id: string;
  name: string;
  mainWidth: number;
  mainDepth: number;
  sideWidth: number;
  sideDepth: number;
  height: number;
  wallsColor: number;
  floorColor: number;
  ceilingColor: number;
};
