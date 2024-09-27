import { WgslReflect } from "wgsl_reflect";

import { N0 } from "../definitions";
import type { Shader } from "../types";

import { createBindGroupLayoutEntriesByGroup } from "./createBindGroupLayoutEntriesByGroup";
import { getVertexAttributeMap } from "./getAttributeMap";
import { getSamplerDescriptors } from "./getSamplerDescriptors";
import { getTextureDescriptors } from "./getTextureDescriptors";
import { getUniformDescriptors } from "./getUniformDescriptors";

export const parseShaderCode = <
  A extends string,
  U extends string,
  T extends string,
  S extends string,
  M extends object,
>(
  code: string,
): Shader<A, U, T, S, M> => {
  const reflect = new WgslReflect(code);
  return {
    attributeMap: getVertexAttributeMap<A>(reflect),
    uniformDescriptors: getUniformDescriptors<U, M>(reflect),
    textureDescriptors: getTextureDescriptors<T>(reflect),
    samplerDescriptors: getSamplerDescriptors<S>(reflect),
    vertexEntry: reflect.entry.vertex[N0]?.name ?? "",
    fragmentEntry: reflect.entry.fragment[N0]?.name ?? "",
    computeEntry: reflect.entry.compute[N0]?.name ?? "",
    bindGroupLayoutEntriesByGroup: createBindGroupLayoutEntriesByGroup(reflect),
  };
};
