import type { VertexFormatInfo } from "../types";

import { assertExists } from "./assertExists";

// prettier-ignore
const vertexFormatInfoMap: ReadonlyMap<GPUVertexFormat, VertexFormatInfo> = new Map([
  ["uint8x2",         { size: 2, bytes: 2,  type: "uint"  }],
  ["uint8x4",         { size: 4, bytes: 4,  type: "uint"  }],
  ["sint8x2",         { size: 2, bytes: 2,  type: "sint"  }],
  ["sint8x4",         { size: 4, bytes: 4,  type: "sint"  }],
  ["unorm8x2",        { size: 2, bytes: 2,  type: "unorm" }],
  ["unorm8x4",        { size: 4, bytes: 4,  type: "unorm" }],
  ["snorm8x2",        { size: 2, bytes: 2,  type: "snorm" }],
  ["snorm8x4",        { size: 4, bytes: 4,  type: "snorm" }],
  ["uint16x2",        { size: 2, bytes: 4,  type: "uint"  }],
  ["uint16x4",        { size: 4, bytes: 8,  type: "uint"  }],
  ["sint16x2",        { size: 2, bytes: 4,  type: "sint"  }],
  ["sint16x4",        { size: 4, bytes: 8,  type: "sint"  }],
  ["unorm16x2",       { size: 2, bytes: 4,  type: "unorm" }],
  ["unorm16x4",       { size: 4, bytes: 8,  type: "unorm" }],
  ["snorm16x2",       { size: 2, bytes: 4,  type: "snorm" }],
  ["snorm16x4",       { size: 4, bytes: 8,  type: "snorm" }],
  ["float16x2",       { size: 2, bytes: 4,  type: "float" }],
  ["float16x4",       { size: 4, bytes: 8,  type: "float" }],
  ["float32",         { size: 1, bytes: 4,  type: "float" }],
  ["float32x2",       { size: 2, bytes: 8,  type: "float" }],
  ["float32x3",       { size: 3, bytes: 12, type: "float" }],
  ["float32x4",       { size: 4, bytes: 16, type: "float" }],
  ["uint32",          { size: 1, bytes: 4,  type: "uint"  }],
  ["uint32x2",        { size: 2, bytes: 8,  type: "uint"  }],
  ["uint32x3",        { size: 3, bytes: 12, type: "uint"  }],
  ["uint32x4",        { size: 4, bytes: 16, type: "uint"  }],
  ["sint32",          { size: 1, bytes: 4,  type: "sint"  }],
  ["sint32x2",        { size: 2, bytes: 8,  type: "sint"  }],
  ["sint32x3",        { size: 3, bytes: 12, type: "sint"  }],
  ["sint32x4",        { size: 4, bytes: 16, type: "sint"  }],
  ["unorm10-10-10-2", { size: 1, bytes: 4,  type: "unorm" }],
]);

export const getVertexFormatInfo = (
  vertexFormat: GPUVertexFormat,
): VertexFormatInfo => {
  const vertexFormatInfo = vertexFormatInfoMap.get(vertexFormat);
  assertExists(vertexFormatInfo, `Format '${vertexFormat}' is not supported`);
  return vertexFormatInfo;
};
