import { UINT16_MAX } from "../definitions";
import type {
  Geometry,
  GeometryDescriptor,
  ShaderVertexAttributeMap,
} from "../types";
import {
  assertExists,
  getIndexFormatInfo,
  getVertexFormatInfo,
} from "../utils";

import { createViewDataSetter } from "./createViewDataSetter";
import { getStrideInfo } from "./getStrideInfo";

export const createVertexBuffers = <T extends string>(
  device: GPUDevice,
  attributeMap: ShaderVertexAttributeMap<T>,
  bufferData: GeometryDescriptor<T>,
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
