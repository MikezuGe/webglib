const one = 1.0;

export const getSizeFromFormat = (format: GPUVertexFormat): number => {
  if (format.includes("x")) {
    const [, n] = format.split("x");
    return Number(n);
  }
  return one;
};
