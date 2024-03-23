const zero = 0.0;
const one = 1.0;
const matchFirstNumberRegex = /\d+/;
const bitsPerByte = 8;

export const getBytesFromFormat = (format: GPUVertexFormat): number => {
  const match = matchFirstNumberRegex.exec(format);
  if (!match) {
    return one;
  }
  return Number(match[zero]) / bitsPerByte;
};
