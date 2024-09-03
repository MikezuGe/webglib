import type { UniformDescriptor } from "./shader";
import { assertExists } from "./utils";

export const createUniformBuffer = (
  device: GPUDevice,
  uniformDescriptors: UniformDescriptor[],
  name: string,
): GPUBuffer => {
  const descriptor = uniformDescriptors.find((u) => u.name === name);
  assertExists(descriptor, `Uniform buffer not found for uniform '${name}'`);
  const buffer = device.createBuffer(descriptor.bufferDescriptor);
  return buffer;
};

export const createUniformBindGroup = (
  device: GPUDevice,
  uniformDescriptors: UniformDescriptor[],
  bindGroupLayoutsByGroup: Record<number, GPUBindGroupLayout>,
  uniformBuffersByName: Record<string, GPUBuffer>,
): { bindGroupIndex: number; bindGroup: GPUBindGroup } => {
  const uniformBufferNames = Object.keys(uniformBuffersByName);
  const [uniformBufferName] = uniformBufferNames;
  const bindGroupIndex = uniformDescriptors.find(
    (u) => u.name === uniformBufferName,
  )?.group;
  assertExists(
    bindGroupIndex,
    `Group not found for uniform '${uniformBufferName}'`,
  );

  /*
  const descriptors = uniformDescriptors.filter((u) => u.group === group);
  if (groupNames.length > descriptors.length) {
    const names = groupNames.filter()
  }
  if (groupNames.length < descriptors.length) {
    
  }
  */

  const bindGroupEntries: GPUBindGroupEntry[] = [];
  for (const name of uniformBufferNames) {
    const buffer = uniformBuffersByName[name];
    const descriptor = uniformDescriptors.find((u) => u.name === name);
    assertExists(
      descriptor,
      `Uniform descriptor not found for uniform '${name}'`,
    );
    if (descriptor.group !== bindGroupIndex) {
      throw new Error(
        `Uniform '${name}' is in group ${descriptor.group} but expected group ${bindGroupIndex}`,
      );
    }
    bindGroupEntries.push({
      binding: descriptor.binding,
      resource: { buffer },
    });
  }
  const bindGroup = device.createBindGroup({
    layout: bindGroupLayoutsByGroup[bindGroupIndex],
    entries: bindGroupEntries,
  });
  return { bindGroupIndex, bindGroup };
};

export const createUniformBuffers = (
  device: GPUDevice,
  uniformDescriptors: UniformDescriptor[],
): Record<string, GPUBuffer> => {
  const uniformBuffersByName: Record<string, GPUBuffer> = {};
  for (const u of uniformDescriptors) {
    uniformBuffersByName[u.name] = device.createBuffer(u.bufferDescriptor);
  }
  return uniformBuffersByName;
};

export const createUniformBindGroups = ({
  device,
  uniformDescriptors,
  bindGroupLayoutsByGroup,
  uniformBuffersByName,
}: {
  device: GPUDevice;
  uniformDescriptors: UniformDescriptor[];
  bindGroupLayoutsByGroup: Record<number, GPUBindGroupLayout>;
  uniformBuffersByName: Record<string, GPUBuffer>;
}): GPUBindGroup[] => {
  const bindGroupEntries: Partial<Record<number, GPUBindGroupEntry[]>> = {};
  for (const u of uniformDescriptors) {
    const buffer = uniformBuffersByName[u.name];
    const bindGroupEntry = bindGroupEntries[u.group] ?? [];
    if (!bindGroupEntry.length) {
      bindGroupEntries[u.group] = bindGroupEntry;
    }
    bindGroupEntry.push({
      binding: u.binding,
      resource: { buffer },
    });
  }

  const bindGroups: GPUBindGroup[] = [];
  for (const group in bindGroupLayoutsByGroup) {
    const layout = bindGroupLayoutsByGroup[group];
    const entries = bindGroupEntries[group];
    if (!entries) {
      continue;
    }
    bindGroups.push(
      device.createBindGroup({
        layout,
        entries,
      }),
    );
  }

  return bindGroups;
};
