import { N1 } from "src/definitions";

export const getSizeFromFormat = (format: GPUVertexFormat): number => {
  const indexOfX = format.indexOf("x");
  if (indexOfX === -N1) {
    return N1;
  }
  const n = format.slice(indexOfX + N1);
  return Number(n);
};
