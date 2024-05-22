import { BYTE_BITS, N4, N0 } from "src/definitions";

const vertexFormatBitsRegex = /8|16|32|10/;

export const getBytesFromFormat = (format: GPUVertexFormat): number => {
  const match = vertexFormatBitsRegex.exec(format);
  if (!match) {
    return N0;
  }
  const [vertexFormatBits] = match;
  if (vertexFormatBits === "10") {
    // unorm10-10-10-2
    // --> (10 + 10 + 10 + 2) / BYTE_BITS
    // --> 32 / 8
    // --> 4
    return N4;
  }
  return Number(vertexFormatBits) / BYTE_BITS;
};
