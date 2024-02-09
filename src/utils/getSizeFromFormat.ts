import { ONE } from "src/definitions";

export const getSizeFromFormat = (format: GPUVertexFormat): number => {
  const indexOfX = format.indexOf("x");
  if (indexOfX === -ONE) {
    return ONE;
  }
  const n = format.slice(indexOfX + ONE);
  return Number(n);
};
