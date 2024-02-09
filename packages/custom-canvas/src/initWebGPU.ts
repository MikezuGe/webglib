import { assertExists } from "@webglib/util";
import { IInitWebGPU, ICustomCanvas } from "./types";

export const initWebGPU = async (
  canvas: ICustomCanvas
): Promise<IInitWebGPU> => {
  const { gpu } = navigator;
  const adapter = await gpu.requestAdapter();
  assertExists(adapter, "No adapter found");
  const device = await adapter.requestDevice();
  const context = canvas.canvasElement.getContext("webgpu");
  assertExists(context, "No webGPU context found");

  const format = gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
  });

  return {
    canvas,
    adapter,
    device,
    context,
    format,
  };
};
