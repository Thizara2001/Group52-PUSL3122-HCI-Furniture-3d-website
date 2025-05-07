import * as THREE from "three";
import { Room } from "./room.ts";
import { Property } from "../property.ts";

export class LivingRoom extends Room {
  private geometry: THREE.BoxGeometry;
  private readonly wallsMaterial: THREE.MeshStandardMaterial;
  private readonly floorMaterial: THREE.MeshStandardMaterial;
  private readonly ceilingMaterial: THREE.MeshStandardMaterial;

  constructor() {
    const name = "Living Room";
    const geometry = new THREE.BoxGeometry(20, 10, 20);
    const wallsMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      side: THREE.BackSide,
    });
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      side: THREE.BackSide,
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
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

    const model = new THREE.Mesh(geometry, materials);
    model.name = name;

    super("livingRoom", name, model);

    this.geometry = geometry;
    this.wallsMaterial = wallsMaterial;
    this.floorMaterial = floorMaterial;
    this.ceilingMaterial = ceilingMaterial;
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Walls Color",
        type: "color",
        get: () => `#${this.wallsMaterial.color.getHexString()}`,
        set: (color: unknown) => {
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          const hexColor = parseInt(color.replace("#", "0x"), 16);
          this.wallsMaterial.color.set(hexColor);
        },
      },
      {
        name: "Floor Color",
        type: "color",
        get: () => `#${this.floorMaterial.color.getHexString()}`,
        set: (color: unknown) => {
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          const hexColor = parseInt(color.replace("#", "0x"), 16);
          this.floorMaterial.color.set(hexColor);
        },
      },
      {
        name: "Ceiling Color",
        type: "color",
        get: () => `#${this.ceilingMaterial.color.getHexString()}`,
        set: (color: unknown) => {
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          const hexColor = parseInt(color.replace("#", "0x"), 16);
          this.ceilingMaterial.color.set(hexColor);
        },
      },
      {
        name: "Width",
        type: "number",
        min: 10,
        max: 30,
        get: () => this.geometry.parameters.width,
        set: (width: unknown) => {
          if (typeof width !== "number") {
            console.error("Invalid width value");
            return;
          }
          this.geometry.dispose();
          this.geometry = new THREE.BoxGeometry(
            width,
            this.geometry.parameters.height,
            this.geometry.parameters.depth,
          );
          this.model.geometry = this.geometry;
        },
      },
      {
        name: "Height",
        type: "number",
        min: 5,
        max: 15,
        get: () => this.geometry.parameters.height,
        set: (height: unknown) => {
          if (typeof height !== "number") {
            console.error("Invalid height value");
            return;
          }
          this.geometry.dispose();
          this.geometry = new THREE.BoxGeometry(
            this.geometry.parameters.width,
            height,
            this.geometry.parameters.depth,
          );
          this.model.geometry = this.geometry;
        },
      },
      {
        name: "Depth",
        type: "number",
        min: 10,
        max: 30,
        get: () => this.geometry.parameters.depth,
        set: (depth: unknown) => {
          if (typeof depth !== "number") {
            console.error("Invalid depth value");
            return;
          }
          this.geometry.dispose();
          this.geometry = new THREE.BoxGeometry(
            this.geometry.parameters.width,
            this.geometry.parameters.height,
            depth,
          );
          this.model.geometry = this.geometry;
        },
      },
    ];
  }
}
