export type Property = {
  name: string;
  type: "string" | "number" | "color";
  min?: unknown;
  max?: unknown;
  get: () => unknown;
  set: (value: unknown) => void;
};
