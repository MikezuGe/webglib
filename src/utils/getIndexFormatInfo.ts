import type { IndexFormatInfo } from "../types";

import { assertExists } from "./assertExists";

const indexFormatInfoMap = new Map<GPUIndexFormat, IndexFormatInfo>([
  ["uint16", { bytes: 2, size: 1, type: "uint" }],
  ["uint32", { bytes: 4, size: 1, type: "uint" }],
]);

export const getIndexFormatInfo = (
  indexFormat: GPUIndexFormat,
): IndexFormatInfo => {
  const indexFormatInfo = indexFormatInfoMap.get(indexFormat);
  assertExists(indexFormatInfo, `Format '${indexFormat}' is not supported`);
  return indexFormatInfo;
};
