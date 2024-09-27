import type { WgslReflect } from "wgsl_reflect";

import type { SamplerDescriptor } from "../types";

export const getSamplerDescriptors = <S extends string>(
  reflect: WgslReflect,
): SamplerDescriptor<S>[] => {
  const samplerDescriptors: SamplerDescriptor<S>[] = [];
  for (const s of reflect.samplers) {
    samplerDescriptors.push({
      group: s.group,
      binding: s.binding,
      name: s.name as S,
    });
  }
  return samplerDescriptors;
};
