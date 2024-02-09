import { BYTE_BITS, FOUR, ZERO } from "src/definitions";

const vertexFormatBitsRegex = /8|16|32|10/;

export const getBytesFromFormat = (format: GPUVertexFormat): number => {
  const match = vertexFormatBitsRegex.exec(format);
  if (!match) {
    return ZERO;
  }
  const [vertexFormatBits] = match;
  if (vertexFormatBits === "10") {
    // unorm10-10-10-2
    // --> (10 + 10 + 10 + 2) / BYTE_BITS
    // --> 32 / 8
    // --> 4
    return FOUR;
  }
  return Number(vertexFormatBits) / BYTE_BITS;
};
