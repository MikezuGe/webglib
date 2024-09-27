import type { SamplerDescriptor, TextureDescriptor } from "../types";
import { assertExists } from "../utils";

export const createTextureBindGroup = <T extends string, S extends string>({
  device,
  samplerDescriptors,
  textureDescriptors,
  bindGroupLayoutsByGroup,
  texturesByName,
  samplersByName,
}: {
  device: GPUDevice;
  samplerDescriptors: SamplerDescriptor<S>[];
  textureDescriptors: TextureDescriptor<T>[];
  bindGroupLayoutsByGroup: Record<number, GPUBindGroupLayout>;
  texturesByName: Partial<Record<T, GPUTexture>>;
  samplersByName: Partial<Record<S, GPUSampler>>;
}): { bindGroupIndex: number; bindGroup: GPUBindGroup } => {
  const textureNames = Object.keys(texturesByName) as T[];
  const [textureName] = textureNames;
  const bindGroupIndex = textureDescriptors.find(
    (u) => u.name === textureName,
  )?.group;
  assertExists(bindGroupIndex, `Group not found for uniform '${textureName}'`);

  const bindGroupEntries: Record<number, GPUBindGroupEntry[]> = {};
  for (const name of textureNames) {
    const texture = texturesByName[name];
    assertExists(texture, `Texture not found for texture '${name}'`);
    const descriptor = textureDescriptors.find((u) => u.name === name);
    assertExists(
      descriptor,
      `Texture descriptor not found for texture '${name}'`,
    );
    const bindGroupEntry = bindGroupEntries[descriptor.group] ?? [];
    if (!bindGroupEntry.length) {
      bindGroupEntries[descriptor.group] = bindGroupEntry;
    }
    bindGroupEntry.push({
      binding: descriptor.binding,
      resource: texture.createView(),
    });
  }

  const samplerNames = Object.keys(samplersByName) as S[];
  for (const name of samplerNames) {
    const sampler = samplersByName[name];
    assertExists(sampler, `Sampler not found for sampler '${name}'`);
    const descriptor = samplerDescriptors.find((u) => u.name === name);
    assertExists(
      descriptor,
      `Sampler descriptor not found for sampler '${name}'`,
    );
    const bindGroupEntry = bindGroupEntries[descriptor.group] ?? [];
    if (!bindGroupEntry.length) {
      bindGroupEntries[descriptor.group] = bindGroupEntry;
    }
    bindGroupEntry.push({
      binding: descriptor.binding,
      resource: sampler,
    });
  }

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayoutsByGroup[bindGroupIndex],
    entries: bindGroupEntries[bindGroupIndex],
  });

  return { bindGroupIndex, bindGroup };
};
