import { PI } from "src/definitions";

const hundredEighty = 180;

export const degToRad = (degrees: number): number => {
  return (degrees * PI) / hundredEighty;
};
