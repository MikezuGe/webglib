import { PI, ROTATION_HALF_DEG } from "../definitions";

export const radToDeg = (radians: number): number => {
  return (radians * ROTATION_HALF_DEG) / PI;
};
