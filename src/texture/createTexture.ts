import type { TextureDescriptor } from "../types";

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
