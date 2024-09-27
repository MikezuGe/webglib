import type { WgslReflect } from "wgsl_reflect";

import { N0 } from "../definitions";

export const createVisibilityGetter = (
  reflect: WgslReflect,
): ((name: string) => number) => {
  const vertexResources =
    reflect.functions.find((f) => f.stage === "vertex")?.resources ?? [];
  const fragmentResources =
    reflect.functions.find((f) => f.stage === "fragment")?.resources ?? [];

  const vertexResourceNameMap = vertexResources.reduce<
    Partial<Record<string, number>>
  >((acc, r) => {
    acc[r.name] = GPUShaderStage.VERTEX;
    return acc;
  }, {});
  const fragmentResourceNameMap = fragmentResources.reduce<
    Partial<Record<string, number>>
  >((acc, r) => {
    acc[r.name] = GPUShaderStage.FRAGMENT;
    return acc;
  }, {});

  return (name: string): number =>
    (vertexResourceNameMap[name] ?? N0) | (fragmentResourceNameMap[name] ?? N0);
};
