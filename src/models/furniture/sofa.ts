import * as THREE from "three";
import { Furniture } from "./furniture.ts";
import { Property } from "../property.ts";

export class Sofa extends Furniture {
  private width = 10;
  private depth = 5;
  private height = 5;
  private readonly scale = 100;
  private color = 0x8b4513;
  public readonly refresh: (floorY: number) => void;

  constructor() {
    const sofa = new THREE.Group();

    super("sofa", "Sofa", sofa as unknown as THREE.Mesh);

    const material = new THREE.MeshStandardMaterial();

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(), material);
    sofa.add(base);

    // Back
    const back = new THREE.Mesh(new THREE.BoxGeometry(), material);
    sofa.add(back);

    // Seat cushion
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(), material);
    sofa.add(cushion);

    // Armrests
    const armGeometry = new THREE.BoxGeometry();
    const leftArm = new THREE.Mesh(armGeometry, material);
    const rightArm = new THREE.Mesh(armGeometry, material);
    sofa.add(leftArm);
    sofa.add(rightArm);

    this.refresh = (floorY) => {
      base.geometry.dispose();
      base.geometry = new THREE.BoxGeometry(this.width, 0.5, this.depth);
      base.position.set(0, 0, 0);
      back.geometry.dispose();
      back.geometry = new THREE.BoxGeometry(
        this.width - 1,
        this.height - 0.5,
        0.5,
      );
      back.position.set(0, this.height / 2, this.depth / 2 - 0.5 / 2);
      cushion.geometry.dispose();
      cushion.geometry = new THREE.BoxGeometry(this.width - 1, 1, this.depth);
      cushion.position.set(0, 0.5 / 2 + 1 / 2, 0);
      const armGeometry = new THREE.BoxGeometry(0.5, 3, this.depth);
      leftArm.geometry.dispose();
      rightArm.geometry.dispose();
      leftArm.geometry = armGeometry;
      rightArm.geometry = armGeometry;
      leftArm.position.set(this.width / 2 - 0.5 / 2, 0.5 / 2 + 3 / 2, 0);
      rightArm.position.set(-this.width / 2 + 0.5 / 2, 0.5 / 2 + 3 / 2, 0);
      material.color.setHex(this.color);
      sofa.position.setY(floorY + 0.5 / 2);
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
          if (typeof value === "number") {
            this.width = value / this.scale;
          }
        },
      },
      {
        name: "Depth (cm)",
        type: "number",
        get: () => this.depth * this.scale,
        set: (value: unknown) => {
          if (typeof value === "number") {
            this.depth = value / this.scale;
          }
        },
      },
      {
        name: "Height (cm)",
        type: "number",
        get: () => this.height * this.scale,
        set: (value: unknown) => {
          if (typeof value === "number") {
            this.height = value / this.scale;
          }
        },
      },
      {
        name: "Color",
        type: "color",
        get: () => `#${this.color.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          this.color = parseInt(color.replace("#", "0x"), 16);
        },
      },
    ];
  }

  public static fromData(dump: SofaData): Sofa {
    const sofa = new Sofa();
    sofa.width = dump.width / 100;
    sofa.depth = dump.depth / 100;
    sofa.height = dump.height / 100;
    sofa.color = parseInt(dump.color.toString(16), 16);
    sofa.model.position.fromArray(dump.position);
    sofa.refresh(0);
    return sofa;
  }

  public dumpData(): SofaData {
    return {
      id: this.id,
      name: this.name,
      position: this.model.position.toArray(),
      width: this.width,
      depth: this.depth,
      height: this.height,
      color: this.color,
    };
  }
}

export type SofaData = {
  id: string;
  name: string;
  position: number[];
  width: number;
  depth: number;
  height: number;
  color: number;
};
