import { UINT16_BYTES, UINT32_BYTES } from "../definitions";
import type { IndexFormatInfo } from "../types";

import { assertExists } from "./assertExists";

const indexFormatInfoMap = new Map<GPUIndexFormat, IndexFormatInfo>([
  ["uint16", { size: 1, bytes: UINT16_BYTES }],
  ["uint32", { size: 1, bytes: UINT32_BYTES }],
]);

export const getIndexFormatInfo = (
  indexFormat: GPUIndexFormat,
): IndexFormatInfo => {
  const indexFormatInfo = indexFormatInfoMap.get(indexFormat);
  assertExists(indexFormatInfo, `Format '${indexFormat}' is not supported`);
  return indexFormatInfo;
};
