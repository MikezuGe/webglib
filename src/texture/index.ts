export * from "./createSampler";
export * from "./createTexture";
export * from "./createTextureBindGroup";

/*
const textureSize: GPUExtent3DStrict = {
  width: 2,
  height: 2,
  depthOrArrayLayers: 1,
};

const r = [255, 0, 0, 255];
const g = [0, 255, 0, 255];
const b = [0, 0, 255, 255];
const w = [255, 255, 255, 255];
device.queue.writeTexture(
  { texture: tColor },
  // prettier-ignore
  new Uint8Array([
    ...r, ...g,
    ...b, ...w
  ]),
  { bytesPerRow: textureSize.width * 4 * UINT8_BYTES },
  textureSize,
);
*/
