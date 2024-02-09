import { PI } from "src/definitions";

const hundredEighty = 180;

export const radToDeg = (radians: number): number => {
  return (radians * hundredEighty) / PI;
};
