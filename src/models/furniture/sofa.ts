import * as THREE from "three";
import { Furniture, Property } from "./furniture.ts";

export class Sofa extends Furniture {
  private geometry: THREE.BoxGeometry;
  private readonly material: THREE.MeshStandardMaterial;

  constructor() {
    const name = "Sofa";
    const geometry = new THREE.BoxGeometry(4, 1, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const model = new THREE.Mesh(geometry, material);
    model.position.set(-5, 0, -5);
    model.name = name;

    super("sofa", name, model);

    this.geometry = geometry;
    this.material = material;
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Color",
        type: "color",
        get: () => `#${this.material.color.getHexString()}`,
        set: (color: unknown) => {
          if (typeof color !== "string") {
            console.error("Invalid color value");
            return;
          }
          const hexColor = parseInt(color.replace("#", "0x"), 16);
          this.material.color.setHex(hexColor);
        },
      },
      {
        name: "Width",
        type: "number",
        min: 1,
        max: 5,
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
        min: 1,
        max: 5,
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
    ];
  }
}
