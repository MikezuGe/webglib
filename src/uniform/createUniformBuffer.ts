import type { UniformBuffersByName, UniformDescriptor } from "../types";
import { assertExists } from "../utils";

export const createUniformBuffer = <T extends string>(
  device: GPUDevice,
  uniformDescriptors: UniformDescriptor<T>[],
  name: T,
): GPUBuffer => {
  const descriptor = uniformDescriptors.find((u) => u.name === name);
  assertExists(descriptor, `Uniform buffer not found for uniform '${name}'`);
  const buffer = device.createBuffer(descriptor.bufferDescriptor);
  return buffer;
};

export const createUniformBuffers = <T extends string>(
  device: GPUDevice,
  uniformDescriptors: UniformDescriptor<T>[],
): UniformBuffersByName<T> => {
  const uniformBuffersByName = {} as UniformBuffersByName<T>;
  for (const u of uniformDescriptors) {
    uniformBuffersByName[u.name] = device.createBuffer(u.bufferDescriptor);
  }
  return uniformBuffersByName;
};
