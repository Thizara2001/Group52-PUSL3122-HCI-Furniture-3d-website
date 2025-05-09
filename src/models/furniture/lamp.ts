import * as THREE from "three";
import { Furniture } from "./furniture.ts";
import { Property } from "../property.ts";

export class Lamp extends Furniture {
  private height = 6;
  private lightColor = 0xffffaa;
  private lightIntensity = 15;
  private readonly scale = 100;
  public readonly refresh: (floorY: number) => void;

  private readonly pointLight: THREE.PointLight;

  constructor() {
    const lampGroup = new THREE.Group();
    super("lamp", "Lamp", lampGroup as unknown as THREE.Mesh);

    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const shadeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.6,
    });

    // Base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.1),
      material,
    );
    base.position.set(0, 0.05, 0);
    lampGroup.add(base);

    // Pole
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, this.height - 1.2),
      material,
    );
    lampGroup.add(pole);

    // Shade
    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32),
      shadeMaterial,
    );
    lampGroup.add(shade);

    // Light
    this.pointLight = new THREE.PointLight(
      this.lightColor,
      this.lightIntensity,
      15,
    );
    lampGroup.add(this.pointLight);

    this.refresh = (floorY) => {
      // Update pole
      pole.geometry.dispose();
      pole.geometry = new THREE.CylinderGeometry(0.1, 0.1, this.height - 1.1);
      pole.position.set(0, (this.height - 1.0) / 2, 0);

      // Update shade
      shade.geometry.dispose();
      shade.geometry = new THREE.CylinderGeometry(0.6, 0.6, 1.1, 32);
      shade.position.set(0, this.height - 0.55, 0);

      // Update light
      this.pointLight.position.set(0, this.height - 0.6, 0);
      this.pointLight.color.setHex(this.lightColor);
      this.pointLight.intensity = this.lightIntensity;

      lampGroup.position.setY(floorY);
    };

    this.refresh(0);
  }

  public getProperties(): Property[] {
    return [
      {
        name: "Height (cm)",
        type: "number",
        get: () => this.height * this.scale,
        set: (value: unknown) => {
          if (typeof value === "number") this.height = value / this.scale;
        },
      },
      {
        name: "Light Intensity",
        type: "number",
        get: () => this.lightIntensity,
        set: (value: unknown) => {
          if (typeof value === "number") this.lightIntensity = value;
        },
      },
      {
        name: "Light Color",
        type: "color",
        get: () => `#${this.lightColor.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string") {
            this.lightColor = parseInt(color.replace("#", "0x"), 16);
          }
        },
      },
    ];
  }

  public static fromData(dump: LampData): Lamp {
    const lamp = new Lamp();
    lamp.height = dump.height / 100;
    lamp.lightIntensity = dump.lightIntensity;
    lamp.lightColor = dump.lightColor;
    lamp.model.position.fromArray(dump.position);
    lamp.refresh(0);
    return lamp;
  }

  public dumpData(): LampData {
    return {
      id: this.id,
      name: this.name,
      position: this.model.position.toArray(),
      height: this.height * this.scale,
      lightIntensity: this.lightIntensity,
      lightColor: this.lightColor,
    };
  }
}

export type LampData = {
  id: string;
  name: string;
  position: number[];
  height: number;
  lightIntensity: number;
  lightColor: number;
};
