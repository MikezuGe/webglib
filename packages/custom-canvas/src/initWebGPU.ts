import { assertExists } from "@webglib/util";
import type { IInitWebGPU, ICustomCanvas } from "@webglib/types";

export const initWebGPU = async (
  canvas: ICustomCanvas
): Promise<IInitWebGPU> => {
  const { gpu } = navigator;
  const adapter = await gpu.requestAdapter();
  assertExists(adapter, "No adapter found");
  const device = await adapter.requestDevice();
  const context = canvas.canvasElement.getContext("webgpu");
  assertExists(context, "No webGPU context found");

  context.configure({
    device,
    format: gpu.getPreferredCanvasFormat(),
  });

  return {
    canvas,
    adapter,
    device,
    context,
  };
};
