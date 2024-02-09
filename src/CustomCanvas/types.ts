import type { CustomCanvas } from "./CustomCanvas";

export interface IInitWebGPU {
  adapter: GPUAdapter;
  canvas: CustomCanvas;
  context: GPUCanvasContext;
  device: GPUDevice;
  textureFormat: GPUTextureFormat;
}
