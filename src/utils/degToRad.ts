import { PI, ROTATION_HALF_DEG } from "../definitions";

export const degToRad = (degrees: number): number => {
  return (degrees * PI) / ROTATION_HALF_DEG;
};
