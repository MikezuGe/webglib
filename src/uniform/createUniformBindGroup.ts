import type {
  BindGroupLayoutsByGroup,
  UniformBuffersByName,
  UniformDescriptor,
} from "../types";
import { assertExists } from "../utils";

export const createUniformBindGroup = <U extends string, M extends object>({
  device,
  uniformDescriptors,
  bindGroupLayoutsByGroup,
  uniformBuffersByName,
}: {
  device: GPUDevice;
  uniformDescriptors: UniformDescriptor<U, M>[];
  bindGroupLayoutsByGroup: BindGroupLayoutsByGroup;
  uniformBuffersByName: Partial<UniformBuffersByName<U>>;
}): { bindGroupIndex: number; bindGroup: GPUBindGroup } => {
  const uniformBufferNames = Object.keys(uniformBuffersByName) as U[];
  const [uniformBufferName] = uniformBufferNames;
  const bindGroupIndex = uniformDescriptors.find(
    (u) => u.name === uniformBufferName,
  )?.group;
  assertExists(
    bindGroupIndex,
    `Group not found for uniform '${uniformBufferName}'`,
  );

  // Validate
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
    assertExists(buffer, `Uniform buffer not found for uniform '${name}'`);
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

export const createUniformBindGroups = <U extends string, M extends object>({
  device,
  uniformDescriptors,
  bindGroupLayoutsByGroup,
  uniformBuffersByName,
}: {
  device: GPUDevice;
  uniformDescriptors: UniformDescriptor<U, M>[];
  bindGroupLayoutsByGroup: BindGroupLayoutsByGroup;
  uniformBuffersByName: UniformBuffersByName<U>;
}): GPUBindGroup[] => {
  const bindGroupEntries: Partial<Record<number, GPUBindGroupEntry[]>> = {};
  for (const { name, group, binding } of uniformDescriptors) {
    const buffer = uniformBuffersByName[name];
    const bindGroupEntry = bindGroupEntries[group] ?? [];
    if (!bindGroupEntry.length) {
      bindGroupEntries[group] = bindGroupEntry;
    }
    bindGroupEntry.push({
      binding,
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
