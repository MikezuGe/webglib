import { CustomCanvas } from "./CustomCanvas";
import type { IInitWebGPU } from "./types";
import { assertExists } from "src/utils";

export const initWebGPU = async (): Promise<IInitWebGPU> => {
  const canvas = new CustomCanvas();
  const adapter = await navigator.gpu.requestAdapter();
  assertExists(adapter, "No adapter found");
  const device = await adapter.requestDevice();
  const context = canvas.canvas.getContext("webgpu");
  assertExists(context, "No webGPU context found");

  const textureFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: textureFormat,
  });

  return {
    adapter,
    canvas,
    context,
    device,
    textureFormat,
  };
};
