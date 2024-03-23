import { getBytesFromFormat, getSizeFromFormat } from "@webglib/util";
import type { IGeometry, IAttribute, ICubeFaceName, I3DVector } from "./types";

const zero = 0.0;
const one = 1.0;

const positionVertices: Readonly<
  Record<
    ICubeFaceName,
    [I3DVector, I3DVector, I3DVector, I3DVector, I3DVector, I3DVector]
  >
> = {
  front: [
    [-one, one, one],
    [-one, -one, one],
    [one, -one, one],
    [-one, one, one],
    [one, -one, one],
    [one, one, one],
  ],
  right: [
    [one, one, one],
    [one, -one, one],
    [one, -one, -one],
    [one, one, one],
    [one, -one, -one],
    [one, one, -one],
  ],
  back: [
    [one, one, -one],
    [one, -one, -one],
    [-one, -one, -one],
    [one, one, -one],
    [-one, -one, -one],
    [-one, one, -one],
  ],
  left: [
    [-one, one, -one],
    [-one, -one, -one],
    [-one, -one, one],
    [-one, one, -one],
    [-one, -one, one],
    [-one, one, one],
  ],
  top: [
    [-one, one, -one],
    [-one, one, one],
    [one, one, one],
    [-one, one, -one],
    [one, one, one],
    [one, one, -one],
  ],
  bottom: [
    [-one, -one, one],
    [-one, -one, -one],
    [one, -one, -one],
    [-one, -one, one],
    [one, -one, -one],
    [one, -one, one],
  ],
};

const colorsMap: Readonly<Record<ICubeFaceName, I3DVector>> = {
  front: [one, zero, zero],
  right: [zero, one, zero],
  back: [zero, zero, one],
  left: [one, one, zero],
  top: [zero, one, one],
  bottom: [one, zero, one],
};

const normalsMap: Readonly<Record<ICubeFaceName, I3DVector>> = {
  front: [zero, zero, one],
  right: [one, zero, zero],
  back: [zero, zero, -one],
  left: [-one, zero, zero],
  top: [zero, one, zero],
  bottom: [zero, -one, zero],
};

const cubeFaceNames: Readonly<ICubeFaceName[]> = [
  "front",
  "right",
  "back",
  "left",
  "top",
  "bottom",
];

const cubeFaceCount = 6;
const cubeFaceVertices = 6;
const cubeVerticeCount = cubeFaceCount * cubeFaceVertices;

const attributeFormatMap: Readonly<Record<IAttribute, GPUVertexFormat>> = {
  color: "float32x3",
  normal: "float32x3",
  position: "float32x3",
};

export class Cube implements IGeometry {
  private readonly _attributes = new Map<IAttribute, GPUVertexAttribute>();
  private _strideBytes = zero;
  private _stride = zero;
  private _verticesByteLength = zero;

  public get stride(): number {
    return this._stride;
  }

  public get strideBytes(): number {
    return this._strideBytes;
  }

  public get verticesByteLength(): number {
    return this._verticesByteLength;
  }

  public get attributes(): GPUVertexAttribute[] {
    return Array.from(this._attributes.values());
  }

  public useAttributes(
    attributes: Partial<Record<IAttribute, GPUIndex32>>
  ): void {
    this._attributes.clear();
    let offset = zero;
    const attributeEntries = Object.entries(attributes) as [
      IAttribute,
      GPUIndex32
    ][];
    for (const [attribute, shaderLocation] of attributeEntries) {
      const format = attributeFormatMap[attribute];
      const size = getSizeFromFormat(format);
      const bytes = getBytesFromFormat(format);
      this._attributes.set(attribute, {
        shaderLocation,
        offset,
        format,
      });
      offset += size * bytes;
    }
    this._updateStride();
  }

  public generateVertices(targetBuffer: Float32Array): void {
    const colorEnabled = this._attributes.has("color");
    const normalEnabled = this._attributes.has("normal");

    let index = 0;
    for (const faceName of cubeFaceNames) {
      const posVert = positionVertices[faceName];
      const [r, g, b] = colorsMap[faceName];
      const [nx, ny, nz] = normalsMap[faceName];

      for (let i = 0; i < cubeFaceVertices; i++) {
        const [x, y, z] = posVert[i];
        targetBuffer[index++] = x;
        targetBuffer[index++] = y;
        targetBuffer[index++] = z;

        if (colorEnabled) {
          targetBuffer[index++] = r;
          targetBuffer[index++] = g;
          targetBuffer[index++] = b;
        }

        if (normalEnabled) {
          targetBuffer[index++] = nx;
          targetBuffer[index++] = ny;
          targetBuffer[index++] = nz;
        }
      }
    }
  }

  private _updateStride(): void {
    let stride = zero;
    let strideBytes = zero;
    for (const { format } of this._attributes.values()) {
      const size = getSizeFromFormat(format);
      const bytes = getBytesFromFormat(format);
      stride += size;
      strideBytes += size * bytes;
    }
    this._stride = stride;
    this._strideBytes = strideBytes;
    this._verticesByteLength = this._strideBytes * cubeVerticeCount;
  }
}
