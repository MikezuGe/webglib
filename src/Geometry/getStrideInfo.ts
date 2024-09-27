import type { GeometryStride, VertexFormat } from "../types";
import { getVertexFormatInfo } from "../utils";

export const getStrideInfo = (formats: VertexFormat[]): GeometryStride => {
  let stride = 0;
  let strideBytes = 0;
  for (const format of formats) {
    const { bytes, size } = getVertexFormatInfo(format);
    stride += size;
    strideBytes += bytes;
  }
  return { stride, strideBytes };
};
