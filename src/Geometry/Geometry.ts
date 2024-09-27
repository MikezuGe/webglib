/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {
  AttributeName,
  GeometryDescriptor,
  VertexBufferData,
} from "../types";

export const createTriangleData = async (
  instanced = true,
): Promise<GeometryDescriptor<AttributeName>> => {
  const indices = [0, 1, 2];
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const vertexBufferData: VertexBufferData<AttributeName>[] = instanced ? [
    {
      attributes: ["position", "uv"],
      formats: ["float32x3", "float32x2"],
      data: [
        0, 1, 0, 0, 1,
        -1, -1, 0, -1, -1,
        1, -1, 0, 1, -1,
      ],
      stepMode: "vertex",
    },
    {
      attributes: ["color"],
      formats: ["unorm8x4"],
      data: [255, 0, 255, 255],
      stepMode: "instance",
    },
  ] : [
    {
      attributes: ["position", "uv", "color"],
      formats: ["float32x3", "float32x2", "unorm8x4"],
      data: [
        0, 1, 0, 0, 1, 255, 0, 0, 255,
        -1, -1, 0, -1, -1, 0, 255, 0, 255,
        1, -1, 0, 1, -1, 0, 0, 255, 255,
      ],
      stepMode: "vertex",
    },
  ];
  return Promise.resolve({
    vertexBufferData,
    primitive: {
      cullMode: "back",
      frontFace: "ccw",
      topology: "triangle-list",
    },
    indices,
  });
};

export const createPlaneData = async (
  instanced = true,
): Promise<GeometryDescriptor<AttributeName>> => {
  const indices = [0, 1, 2, 0, 2, 3];
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const vertexBufferData: VertexBufferData<AttributeName>[] = instanced ? [
    {
      attributes: ["position", "uv"],
      formats: ["float32x3", "float32x2"],
      data: [
        -1, 1, 0, 0, 0,
        -1, -1, 0, 0, 1,
        1, -1, 0, 1, 1,
        1, 1, 0, 1, 0,
      ],
      stepMode: "vertex",
    },
    {
      attributes: ["color"],
      formats: ["unorm8x4"],
      data: [255, 0, 255, 255],
      stepMode: "instance",
    },
  ] : [
    {
      attributes: ["position", "uv", "color"],
      formats: ["float32x3", "float32x2", "unorm8x4"],
      data: [
        -1, 1, 0, 0, 0, 255, 0, 0, 255,
        -1, -1, 0, 0, 1, 0, 255, 0, 255,
        1, -1, 0, 1, 1, 0, 0, 255, 255,
        1, 1, 0, 1, 0, 0, 0, 255, 255,
      ],
      stepMode: "vertex",
    },
  ];
  return Promise.resolve({
    vertexBufferData,
    primitive: {
      cullMode: "back",
      frontFace: "ccw",
      topology: "triangle-list",
    },
    indices,
  });
};
