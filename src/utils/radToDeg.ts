import { N2, PI, ROTATION_FULL_DEG } from "src/definitions";

const halfRotationDeg = ROTATION_FULL_DEG / N2;

export const radToDeg = (radians: number): number => {
  return (radians * halfRotationDeg) / PI;
};
