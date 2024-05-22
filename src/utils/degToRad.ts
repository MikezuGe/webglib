import { N2, PI, ROTATION_FULL_DEG } from "src/definitions";

const halfRotationDeg = ROTATION_FULL_DEG / N2;

export const degToRad = (degrees: number): number => {
  return (degrees * PI) / halfRotationDeg;
};
