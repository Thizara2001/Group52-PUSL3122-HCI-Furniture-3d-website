import * as THREE from "three";
import { Furniture } from "./furniture.ts";
import { Property } from "../property.ts";

export class Table extends Furniture {
  private width = 8;
  private depth = 5;
  private readonly height = 4;
  private readonly scale = 100;
  private color = 0xdeb887; // burlywood
  public readonly refresh: (floorY: number) => void;

  constructor() {
    const table = new THREE.Group();
    super("table", "Table", table as unknown as THREE.Mesh);

    const material = new THREE.MeshStandardMaterial();

    // Tabletop
    const top = new THREE.Mesh(new THREE.BoxGeometry(), material);
    table.add(top);

    // Legs
    const legGeometry = new THREE.BoxGeometry();
    const leg1 = new THREE.Mesh(legGeometry, material);
    const leg2 = new THREE.Mesh(legGeometry, material);
    const leg3 = new THREE.Mesh(legGeometry, material);
    const leg4 = new THREE.Mesh(legGeometry, material);

    table.add(leg1);
    table.add(leg2);
    table.add(leg3);
    table.add(leg4);

    this.refresh = (floorY) => {
      material.color.setHex(this.color);

      top.geometry.dispose();
      top.geometry = new THREE.BoxGeometry(this.width, 0.3, this.depth);
      top.position.set(0, this.height, 0);

      const legW = 0.3;
      const legH = this.height;
      const legG = new THREE.BoxGeometry(legW, legH, legW);

      [leg1, leg2, leg3, leg4].forEach((leg) => {
        leg.geometry.dispose();
        leg.geometry = legG;
      });

      leg1.position.set(
        this.width / 2 - legW / 2,
        legH / 2,
        this.depth / 2 - legW / 2,
      );
      leg2.position.set(
        this.width / 2 - legW / 2,
        legH / 2,
        -this.depth / 2 + legW / 2,
      );
      leg3.position.set(
        -this.width / 2 + legW / 2,
        legH / 2,
        this.depth / 2 - legW / 2,
      );
      leg4.position.set(
        -this.width / 2 + legW / 2,
        legH / 2,
        -this.depth / 2 + legW / 2,
      );

      table.position.setY(floorY);
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
          if (typeof value === "number") this.width = value / this.scale;
        },
      },
      {
        name: "Depth (cm)",
        type: "number",
        get: () => this.depth * this.scale,
        set: (value: unknown) => {
          if (typeof value === "number") this.depth = value / this.scale;
        },
      },
      {
        name: "Color",
        type: "color",
        get: () => `#${this.color.toString(16)}`,
        set: (color: unknown) => {
          if (typeof color === "string") {
            this.color = parseInt(color.replace("#", "0x"), 16);
          }
        },
      },
    ];
  }

  public static fromData(dump: TableData): Table {
    const table = new Table();
    table.width = dump.width / 100;
    table.depth = dump.depth / 100;
    table.color = parseInt(dump.color.toString(16), 16);
    table.model.position.fromArray(dump.position);
    table.refresh(0);
    return table;
  }

  public dumpData(): TableData {
    return {
      id: this.id,
      name: this.name,
      position: this.model.position.toArray(),
      width: this.width * this.scale,
      depth: this.depth * this.scale,
      color: this.color,
    };
  }
}

export type TableData = {
  id: string;
  name: string;
  position: number[];
  width: number;
  depth: number;
  color: number;
};
