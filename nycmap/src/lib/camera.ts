export type CameraCommand = {
  id: number;
  mode: "fly" | "fit";
  center?: [number, number];
  zoom?: number;
  bounds?: [[number, number], [number, number]];
};
