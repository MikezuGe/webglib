/* eslint-disable @typescript-eslint/no-magic-numbers */
import { UINT16_MAX } from "./definitions";
import type { AttributeMap } from "./shader";
import { assertExists, getIndexFormatInfo, getVertexFormatInfo } from "./utils";

// Supported attributes in vertex shader
type Attribute = "position" | "uv" | "color";

type VertexFormatPicker<T extends GPUVertexFormat> = T;
// Supported vertex formats
type VertexFormat = VertexFormatPicker<
  "float32" | "float32x2" | "float32x3" | "float32x4" | "unorm8x4"
>;

interface VertexBufferData {
  data: number[];
  formats: VertexFormat[];
  attributes: Attribute[];
  stepMode: GPUVertexStepMode;
}

interface GeometryDescriptor {
  vertexBufferData: VertexBufferData[];
  primitive: GPUPrimitiveState;
  indices?: number[];
}

interface GeometryRequired {
  drawCount: number;
  primitive: GPUPrimitiveState;
  vertexBuffers: GPUBuffer[];
  vertexBufferLayout: GPUVertexBufferLayout[];
}

interface GeometryPartial {
  indexBuffer: GPUBuffer;
  indexFormat: GPUIndexFormat;
}

type Geometry = GeometryRequired & AllOrNone<GeometryPartial>;

type ViewDataSetter = (dataOffset: number, bufferOffset: number) => void;

interface GeometryStride {
  stride: number;
  strideBytes: number;
}

const instanced = true;
export const createTriangleData = async (): Promise<GeometryDescriptor> => {
  const indices = [0, 1, 2];
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const vertexBufferData: VertexBufferData[] = instanced ? [
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

export const createPlaneData = async (): Promise<GeometryDescriptor> => {
  const indices = [0, 1, 2, 0, 2, 3];
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const vertexBufferData: VertexBufferData[] = instanced ? [
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

const createViewDataSetter = (
  view: DataView,
  data: number[],
  format: GPUVertexFormat,
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
      throw new Error(`Unsupported format for view data setter: ${format}`);
  }
};

const getStrideInfo = (formats: VertexFormat[]): GeometryStride => {
  let stride = 0;
  let strideBytes = 0;
  for (const format of formats) {
    const { bytes, size } = getVertexFormatInfo(format);
    stride += size;
    strideBytes += bytes;
  }
  return { stride, strideBytes };
};

export const createBuffers = (
  device: GPUDevice,
  attributeMap: AttributeMap,
  bufferData: GeometryDescriptor,
): Geometry => {
  const { indices, primitive, vertexBufferData } = bufferData;

  const vertexBuffers: GPUBuffer[] = [];
  const vertexBufferLayout: GPUVertexBufferLayout[] = [];
  for (const {
    data,
    formats,
    stepMode,
    attributes: vertexAttributes,
  } of vertexBufferData) {
    const dataLength = data.length;
    const { stride, strideBytes } = getStrideInfo(formats);
    const attributes: GPUVertexAttribute[] = [];
    let vertexAttributeIndex = 0;
    let dataOffset = 0;
    let bufferOffset = 0;

    const buffer = device.createBuffer({
      size: (dataLength / stride) * strideBytes,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    const view = new DataView(buffer.getMappedRange());

    for (const format of formats) {
      const vertexAttribute = vertexAttributes[vertexAttributeIndex++];
      const attribute = attributeMap[vertexAttribute];
      assertExists(
        attribute,
        `Attribute '${vertexAttribute}' not supported by vertex shader`,
      );
      const { shaderLocation } = attribute;
      const { bytes, size } = getVertexFormatInfo(format);
      attributes.push({ shaderLocation, offset: bufferOffset, format });

      const viewDataSetter = createViewDataSetter(view, data, format);
      for (
        let i = dataOffset, j = bufferOffset;
        i < dataLength;
        i += stride, j += strideBytes
      ) {
        viewDataSetter(i, j);
      }

      bufferOffset += bytes;
      dataOffset += size;
    }
    buffer.unmap();

    vertexBufferLayout.push({
      arrayStride: strideBytes,
      stepMode,
      attributes,
    });

    vertexBuffers.push(buffer);
  }

  if (!indices) {
    const index = vertexBufferLayout.findIndex(
      (layout) => layout.stepMode === "vertex",
    );
    return {
      drawCount:
        vertexBuffers[index].size / vertexBufferLayout[index].arrayStride,
      primitive,
      vertexBuffers,
      vertexBufferLayout,
    };
  }

  const indexFormat: GPUIndexFormat =
    indices.length > UINT16_MAX ? "uint32" : "uint16";
  let indexBytes = getIndexFormatInfo(indexFormat).bytes * indices.length;

  const divider = 4;
  const indicesBytesMod4 = indexBytes % divider;
  if (indicesBytesMod4) {
    indexBytes += divider - indicesBytesMod4;
  }

  const indexBuffer = device.createBuffer({
    size: indexBytes,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  if (indexFormat === "uint32") {
    new Uint32Array(indexBuffer.getMappedRange()).set(indices);
  } else {
    new Uint16Array(indexBuffer.getMappedRange()).set(indices);
  }
  indexBuffer.unmap();

  return {
    drawCount: indices.length,
    indexBuffer,
    indexFormat,
    vertexBufferLayout,
    vertexBuffers,
    primitive,
  };
};
