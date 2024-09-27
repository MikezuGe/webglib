/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { VertexFormat, ViewDataSetter } from "../types";

export const createViewDataSetter = (
  view: DataView,
  data: number[],
  format: VertexFormat,
): ViewDataSetter => {
  switch (format) {
    case "float32":
      return (dataOffset, bufferOffset) => {
        view.setFloat32(bufferOffset, data[dataOffset], true);
      };
    case "float32x2":
      return (dataOffset, bufferOffset) => {
        view.setFloat32(bufferOffset + 0, data[dataOffset + 0], true);
        view.setFloat32(bufferOffset + 4, data[dataOffset + 1], true);
      };
    case "float32x3":
      return (dataOffset, bufferOffset) => {
        view.setFloat32(bufferOffset + 0, data[dataOffset + 0], true);
        view.setFloat32(bufferOffset + 4, data[dataOffset + 1], true);
        view.setFloat32(bufferOffset + 8, data[dataOffset + 2], true);
      };
    case "float32x4":
      return (dataOffset, bufferOffset) => {
        view.setFloat32(bufferOffset + 0, data[dataOffset + 0], true);
        view.setFloat32(bufferOffset + 4, data[dataOffset + 1], true);
        view.setFloat32(bufferOffset + 8, data[dataOffset + 2], true);
        view.setFloat32(bufferOffset + 12, data[dataOffset + 3], true);
      };
    case "unorm8x4":
      return (dataOffset, bufferOffset) => {
        view.setUint8(bufferOffset + 0, data[dataOffset + 0]);
        view.setUint8(bufferOffset + 1, data[dataOffset + 1]);
        view.setUint8(bufferOffset + 2, data[dataOffset + 2]);
        view.setUint8(bufferOffset + 3, data[dataOffset + 3]);
      };
    default:
      throw new Error(
        `Unsupported format for view data setter: ${format as GPUVertexFormat}`,
      );
  }
};
