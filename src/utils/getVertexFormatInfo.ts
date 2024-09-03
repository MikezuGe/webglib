import {
  FLOAT16_BYTES,
  FLOAT32_BYTES,
  SINT8_BYTES,
  SINT16_BYTES,
  SINT32_BYTES,
  UINT8_BYTES,
  UINT16_BYTES,
  UINT32_BYTES,
} from "../definitions";
import type { VertexFormatInfo } from "../types";

import { assertExists } from "./assertExists";

// prettier-ignore
const vertexFormatInfoMap: ReadonlyMap<GPUVertexFormat, VertexFormatInfo> = new Map([
  ["uint8x2",         { size: 2, bytes: 2,  elementBytes: UINT8_BYTES   }],
  ["uint8x4",         { size: 4, bytes: 4,  elementBytes: UINT8_BYTES   }],
  ["sint8x2",         { size: 2, bytes: 2,  elementBytes: SINT8_BYTES   }],
  ["sint8x4",         { size: 4, bytes: 4,  elementBytes: SINT8_BYTES   }],
  ["unorm8x2",        { size: 2, bytes: 2,  elementBytes: UINT8_BYTES   }],
  ["unorm8x4",        { size: 4, bytes: 4,  elementBytes: UINT8_BYTES   }],
  ["snorm8x2",        { size: 2, bytes: 2,  elementBytes: SINT8_BYTES   }],
  ["snorm8x4",        { size: 4, bytes: 4,  elementBytes: SINT8_BYTES   }],
  ["uint16x2",        { size: 2, bytes: 4,  elementBytes: FLOAT16_BYTES }],
  ["uint16x4",        { size: 4, bytes: 8,  elementBytes: FLOAT16_BYTES }],
  ["sint16x2",        { size: 2, bytes: 4,  elementBytes: SINT16_BYTES  }],
  ["sint16x4",        { size: 4, bytes: 8,  elementBytes: SINT16_BYTES  }],
  ["unorm16x2",       { size: 2, bytes: 4,  elementBytes: UINT16_BYTES  }],
  ["unorm16x4",       { size: 4, bytes: 8,  elementBytes: UINT16_BYTES  }],
  ["snorm16x2",       { size: 2, bytes: 4,  elementBytes: SINT16_BYTES  }],
  ["snorm16x4",       { size: 4, bytes: 8,  elementBytes: SINT16_BYTES  }],
  ["float16x2",       { size: 2, bytes: 4,  elementBytes: FLOAT16_BYTES }],
  ["float16x4",       { size: 4, bytes: 8,  elementBytes: FLOAT16_BYTES }],
  ["float32",         { size: 1, bytes: 4,  elementBytes: FLOAT32_BYTES }],
  ["float32x2",       { size: 2, bytes: 8,  elementBytes: FLOAT32_BYTES }],
  ["float32x3",       { size: 3, bytes: 12, elementBytes: FLOAT32_BYTES }],
  ["float32x4",       { size: 4, bytes: 16, elementBytes: FLOAT32_BYTES }],
  ["uint32",          { size: 1, bytes: 4,  elementBytes: UINT32_BYTES  }],
  ["uint32x2",        { size: 2, bytes: 8,  elementBytes: UINT32_BYTES  }],
  ["uint32x3",        { size: 3, bytes: 12, elementBytes: UINT32_BYTES  }],
  ["uint32x4",        { size: 4, bytes: 16, elementBytes: UINT32_BYTES  }],
  ["sint32",          { size: 1, bytes: 4,  elementBytes: SINT32_BYTES  }],
  ["sint32x2",        { size: 2, bytes: 8,  elementBytes: SINT32_BYTES  }],
  ["sint32x3",        { size: 3, bytes: 12, elementBytes: SINT32_BYTES  }],
  ["sint32x4",        { size: 4, bytes: 16, elementBytes: SINT32_BYTES  }],
  ["unorm10-10-10-2", { size: 1, bytes: 4,  elementBytes: UINT32_BYTES  }],
]);

export const getVertexFormatInfo = (
  vertexFormat: GPUVertexFormat,
): VertexFormatInfo => {
  const vertexFormatInfo = vertexFormatInfoMap.get(vertexFormat);
  assertExists(vertexFormatInfo, `Format '${vertexFormat}' is not supported`);
  return vertexFormatInfo;
};
