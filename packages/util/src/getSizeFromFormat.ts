const minusOne = -1;
const one = 1;

export const getSizeFromFormat = (format: GPUVertexFormat): number => {
  const indexOfX = format.indexOf("x");
  if (indexOfX === minusOne) {
    return one;
  }
  const n = format.slice(indexOfX + one);
  return Number(n);
};
