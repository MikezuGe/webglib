import { Geometry } from "./Geometry";
import type { ICubeFaceName, I3DVector } from "@webglib/types";

const zero = 0;
const one = 1;

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

export class Cube extends Geometry {
  protected _verticesCount = cubeVerticeCount;

  public generateVertices(
    targetBuffer = new Float32Array(this._verticesCount * this._strideCount)
  ): Float32Array {
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
    return targetBuffer;
  }
}
