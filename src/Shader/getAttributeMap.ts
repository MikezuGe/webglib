import type { WgslReflect } from "wgsl_reflect";

import type { ShaderVertexAttribute, ShaderVertexAttributeMap } from "../types";

export const getVertexAttributeMap = <A extends string>(
  reflect: WgslReflect,
): ShaderVertexAttributeMap<A> => {
  const [{ inputs }] = reflect.entry.vertex;
  const attributeMap = {} as { [K in A]: ShaderVertexAttribute<K> };
  for (const i of inputs) {
    attributeMap[i.name as A] = {
      name: i.name as A,
      shaderLocation: Number(i.location),
    };
  }
  return attributeMap;
};
