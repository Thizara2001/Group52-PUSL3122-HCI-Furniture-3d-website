import * as THREE from "three";

export abstract class Furniture {
  protected readonly id: string;
  protected readonly name: string;
  protected readonly model: THREE.Mesh;

  protected constructor(id: string, name: string, mesh: THREE.Mesh) {
    this.id = id;
    this.name = name;
    this.model = mesh;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getModel(): THREE.Mesh {
    return this.model;
  }

  public abstract getProperties(): Property[];
}

export type Property = {
  name: string;
  type: "string" | "number" | "color";
  min?: unknown;
  max?: unknown;
  get: () => unknown;
  set: (value: unknown) => void;
};
