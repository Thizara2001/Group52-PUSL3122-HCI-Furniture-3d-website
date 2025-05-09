import * as THREE from "three";
import { Room } from "./room.ts";
import { Property } from "../property.ts";

export class PartyRoom extends Room {
  private mainWidth = 20;
  private mainDepth = 20;
  private sideWidth = 10;
  private sideDepth = 10;
  private height = 10;

  private wallsColor = 0xe0e0e0;
  private floorColor = 0xd0c8c0;
  private ceilingColor = 0xf5f5f5;

  public readonly refresh: () => void;

  constructor() {
    const name = "Party Room";

    const group = new THREE.Group();
    group.name = name;

    super("partyRoom", name, group as unknown as THREE.Mesh);

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
    const transparentMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });

    const mainRoomMaterial = [
      wallMaterial, // left
      wallMaterial, // right
      ceilingMaterial, // top
      floorMaterial, // bottom
      wallMaterial, // front
      transparentMaterial, // back (connects to side room)
    ];

    const sideRoomMaterial = [
      wallMaterial, // left
      wallMaterial, // right
      ceilingMaterial, // top
      floorMaterial, // bottom
      transparentMaterial, // front (connects to main room)
      wallMaterial, // back
    ];

    const mainRoom = new THREE.Mesh(new THREE.BoxGeometry(), mainRoomMaterial);
    const sideRoom = new THREE.Mesh(new THREE.BoxGeometry(), sideRoomMaterial);
    const leftHalfWall = new THREE.Mesh(
      new THREE.PlaneGeometry(),
      wallMaterial,
    );
    const rightHalfWall = new THREE.Mesh(
      new THREE.PlaneGeometry(),
      wallMaterial,
    );

    group.add(mainRoom, sideRoom, leftHalfWall, rightHalfWall);

    this.refresh = () => {
      mainRoom.geometry.dispose();
      sideRoom.geometry.dispose();
      leftHalfWall.geometry.dispose();
      rightHalfWall.geometry.dispose();

      // Main box
      mainRoom.geometry = new THREE.BoxGeometry(
        this.mainWidth,
        this.height,
        this.mainDepth,
      );
      mainRoom.position.set(0, 0, 0);

      // Side box (centered on back of main room)
      sideRoom.geometry = new THREE.BoxGeometry(
        this.sideWidth,
        this.height,
        this.sideDepth,
      );
      sideRoom.position.set(0, 0, -this.mainDepth / 2 - this.sideDepth / 2);

      // Half-wall (optional visual divider)
      const halfWallGeometry = new THREE.PlaneGeometry(
        this.mainWidth / 2 - this.sideWidth / 2,
        this.height,
      );
      leftHalfWall.geometry = halfWallGeometry;
      rightHalfWall.geometry = halfWallGeometry;
      leftHalfWall.position.set(
        this.mainWidth / 4 + this.sideWidth / 4,
        0,
        -this.mainDepth / 2,
      );
      rightHalfWall.position.set(
        -this.mainWidth / 4 - this.sideWidth / 4,
        0,
        -this.mainDepth / 2,
      );
      leftHalfWall.rotation.y = Math.PI;
      rightHalfWall.rotation.y = Math.PI;

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
        max: 30,
        get: () => this.mainWidth,
        set: (value: unknown) => {
          if (typeof value === "number") this.mainWidth = value;
        },
      },
      {
        name: "Main Depth",
        type: "number",
        min: 8,
        max: 30,
        get: () => this.mainDepth,
        set: (value: unknown) => {
          if (typeof value === "number") this.mainDepth = value;
        },
      },
      {
        name: "Side Width",
        type: "number",
        min: 4,
        max: 15,
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

  public static fromData(dump: PartyRoomData): PartyRoom {
    const room = new PartyRoom();
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

  public dumpData(): PartyRoomData {
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

export type PartyRoomData = {
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
