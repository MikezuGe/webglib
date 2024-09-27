import type { WgslReflect } from "wgsl_reflect";

import type { TextureDescriptor } from "../types";

export const getTextureDescriptors = <T extends string>(
  reflect: WgslReflect,
): TextureDescriptor<T>[] => {
  const textureDescriptors: TextureDescriptor<T>[] = [];
  for (const t of reflect.textures) {
    textureDescriptors.push({
      group: t.group,
      binding: t.binding,
      name: t.name as T,
    });
  }
  return textureDescriptors;
};
