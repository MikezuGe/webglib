import type { AttributeInfo, AttributeName } from "../types";

import { assertExists } from "./assertExists";

// prettier-ignore
const attributeInfoMap = new Map<AttributeName, AttributeInfo>([
  ["position", { format: "float32x3", shaderLocation: 0 }],
  ["uv",       { format: "float32x2", shaderLocation: 1 }],
  ["normal",   { format: "float32x3", shaderLocation: 2 }],
]);

export const getAttributeInfo = (attribute: AttributeName): AttributeInfo => {
  const info = attributeInfoMap.get(attribute);
  assertExists(info, `Attribute '${attribute}' is not supported`);
  return info;
};
