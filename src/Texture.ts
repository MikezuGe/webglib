// @ts-expect-error - error
import * as anyAssetsUrls from "url:./assets/**/*";

import type { SamplerDescriptor, TextureDescriptor } from "./shader";
import { assertExists } from "./utils";

export const loadTexture = async (name: string): Promise<ImageBitmap> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const res = await fetch(anyAssetsUrls.textures[name]);
  const blob = await res.blob();
  const imageBitmap = await createImageBitmap(blob, {
    colorSpaceConversion: "none",
  });
  return imageBitmap;
};

export const createSampler = (
  device: GPUDevice,
  samplerDescriptor: GPUSamplerDescriptor,
): GPUSampler => {
  const sampler = device.createSampler(samplerDescriptor);
  return sampler;
};

export const createSamplers = (
  device: GPUDevice,
  samplerDescriptors: SamplerDescriptor[],
  samplerDataMap: Record<string, GPUSamplerDescriptor>,
): Record<string, GPUSampler> => {
  const samplersByName: Record<string, GPUSampler> = {};
  for (const s of samplerDescriptors) {
    const samplerDescriptor = samplerDataMap[s.name];
    const sampler = device.createSampler(samplerDescriptor);
    samplersByName[s.name] = sampler;
  }
  return samplersByName;
};

export const createTexture = (
  device: GPUDevice,
  textureData: { imageBitmap: ImageBitmap; size: GPUExtent3DStrict },
): GPUTexture => {
  const texture = device.createTexture({
    size: textureData.size,
    format: "rgba8unorm",
    usage:
      GPUTextureUsage.RENDER_ATTACHMENT |
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST,
  });
  device.queue.copyExternalImageToTexture(
    { source: textureData.imageBitmap },
    { texture: texture, premultipliedAlpha: true },
    textureData.size,
  );
  return texture;
};

export const createTextures = (
  device: GPUDevice,
  textureDescriptors: TextureDescriptor[],
  textureDataMap: Record<
    string,
    { imageBitmap: ImageBitmap; size: GPUExtent3DStrict }
  >,
): Record<string, GPUTexture> => {
  const texturesByBinding: Record<string, GPUTexture> = {};

  for (const t of textureDescriptors) {
    const textureData = textureDataMap[t.name];
    const texture = device.createTexture({
      size: textureData.size,
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST,
    });
    device.queue.copyExternalImageToTexture(
      { source: textureData.imageBitmap },
      { texture: texture, premultipliedAlpha: true },
      textureData.size,
    );
    texturesByBinding[t.name] = texture;
  }

  return texturesByBinding;
};

export const createTextureBindGroup = ({
  device,
  samplerDescriptors,
  textureDescriptors,
  bindGroupLayoutsByGroup,
  texturesByName,
  samplersByName,
}: {
  device: GPUDevice;
  samplerDescriptors: SamplerDescriptor[];
  textureDescriptors: TextureDescriptor[];
  bindGroupLayoutsByGroup: Record<number, GPUBindGroupLayout>;
  texturesByName: Record<string, GPUTexture>;
  samplersByName: Record<string, GPUSampler>;
}): { bindGroupIndex: number; bindGroup: GPUBindGroup } => {
  const textureNames = Object.keys(texturesByName);
  const [textureName] = textureNames;
  const bindGroupIndex = textureDescriptors.find(
    (u) => u.name === textureName,
  )?.group;
  assertExists(bindGroupIndex, `Group not found for uniform '${textureName}'`);

  const bindGroupEntries: Record<number, GPUBindGroupEntry[]> = {};
  for (const name of textureNames) {
    const texture = texturesByName[name];
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

  const samplerNames = Object.keys(samplersByName);
  for (const name of samplerNames) {
    const sampler = samplersByName[name];
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
