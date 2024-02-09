import type { IInitWebGPU } from "../types";
import { assertExists } from "../utils";

import { CustomCanvas } from "./CustomCanvas";

export const initWebGPU = async (): Promise<IInitWebGPU> => {
  const canvas = CustomCanvas.create();
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
