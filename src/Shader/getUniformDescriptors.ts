import type { WgslReflect } from "wgsl_reflect";

import type { UniformDescriptor, UniformWriterDescriptor } from "../types";

export const getUniformDescriptors = <U extends string, W extends object>(
  reflect: WgslReflect,
): UniformDescriptor<U, W>[] => {
  const uniformDescriptors: UniformDescriptor<U, W>[] = [];
  const usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
  for (const u of reflect.uniforms) {
    const writerDescriptors: UniformWriterDescriptor<U, W>[] = [];
    if (u.members) {
      for (const m of u.members) {
        writerDescriptors.push({
          name: m.name as U extends keyof W ? W[U] : U,
          offset: m.offset,
        });
      }
    } else {
      writerDescriptors.push({
        name: u.name as U extends keyof W ? W[U] : U,
        offset: 0,
      });
    }
    uniformDescriptors.push({
      name: u.name as U,
      group: u.group,
      binding: u.binding,
      bufferDescriptor: { size: u.size, usage },
      writerDescriptors,
    });
  }
  return uniformDescriptors;
};
