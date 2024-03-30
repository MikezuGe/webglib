const zero = 0;
const matchFirstNumberRegex = /8|16|32|10/;
const bitsPerByte = 8;

export const getBytesFromFormat = (format: GPUVertexFormat): number => {
  const match = matchFirstNumberRegex.exec(format);
  if (!match) {
    return zero;
  }
  return Number(match[zero]) / bitsPerByte;
};
