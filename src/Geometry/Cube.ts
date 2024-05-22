import {
  CUBE_DEFAULT_STRIDE,
  CUBE_DEFAULT_VERTICES,
  CUBE_DEFAULT_VERTICES_INDICED,
  FLOAT32_BYTES,
  N0,
  N1,
  N2,
  N3,
  UINT16_BYTES,
  UINT32_BYTES,
} from "src/definitions";
import { calculateSurfaceNormal } from "src/utils";

import { Geometry } from "./Geometry";
import { GeometryAttributes } from "./types";

const X_L = -1;
const X_R = 1;
const Y_T = 1;
const Y_B = -1;
const Z_F = 1;
const Z_B = -1;

export class Cube extends Geometry {
  protected _stride = CUBE_DEFAULT_STRIDE;
  protected _vertices = CUBE_DEFAULT_VERTICES;
  protected _indices = this._vertices;
  protected _strideBytes = this._stride * FLOAT32_BYTES;
  protected _verticesBytes = this._vertices * this._strideBytes;
  protected _indicesBytes = this._indices * UINT16_BYTES;

  public generateVertices(
    arrayBuffer: Float32Array,
    indexBuffer?: Uint16Array | Uint32Array,
  ): void {
    if (this._indiced && this._attributesMap.has(GeometryAttributes.normal)) {
      throw new Error(
        "Cube geometry does not support normals when using indices",
      );
    }

    const { _stride } = this;
    let offsetOffset = 0;

    if (this._indiced) {
      // prettier-ignore
      arrayBuffer.set([
        // Front face clockwise observed from front
        X_L, Y_T, Z_F,
        X_L, Y_B, Z_F,
        X_R, Y_B, Z_F,
        X_R, Y_T, Z_F,
        // Back face clockwise observed from front
        X_L, Y_T, Z_B,
        X_L, Y_B, Z_B,
        X_R, Y_B, Z_B,
        X_R, Y_T, Z_B,
      ]);
      const tlf = 0;
      const blf = 1;
      const brf = 2;
      const trf = 3;
      const tlb = 4;
      const blb = 5;
      const brb = 6;
      const trb = 7;
      for (let i = 0; i < CUBE_DEFAULT_VERTICES; i++) {
        // prettier-ignore
        indexBuffer?.set([
          // front
          tlf, blf, brf, tlf, brf, trf,
          // right
          trf, brf, brb, trf, brb, trb,
          // back
          trb, brb, blb, trb, blb, tlb,
          // left
          tlb, blb, blf, tlb, blf, tlf,
          // top
          tlb, tlf, trf, tlb, trf, trb,
          // bottom
          blf, blb, brb, blf, brb, brf,
        ]);
      }
      return;
    }

    let offset = offsetOffset;
    offsetOffset += N3;
    // front
    arrayBuffer.set([X_L, Y_T, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_T, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_T, Z_F], offset);
    offset += _stride;
    // right
    arrayBuffer.set([X_R, Y_T, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_T, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_T, Z_B], offset);
    offset += _stride;
    // back
    arrayBuffer.set([X_R, Y_T, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_T, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_T, Z_B], offset);
    offset += _stride;
    // left
    arrayBuffer.set([X_L, Y_T, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_T, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_T, Z_F], offset);
    offset += _stride;
    // top
    arrayBuffer.set([X_L, Y_T, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_T, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_T, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_T, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_T, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_T, Z_B], offset);
    offset += _stride;
    // bottom
    arrayBuffer.set([X_L, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_L, Y_B, Z_F], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_B], offset);
    offset += _stride;
    arrayBuffer.set([X_R, Y_B, Z_F], offset);
    offset += _stride;

    if (this._attributesMap.has(GeometryAttributes.normal)) {
      offset = offsetOffset;
      const normal = [N0, N0, N0];
      const arrayBufferLength = arrayBuffer.length;
      for (let i = 0; i < arrayBufferLength; i += _stride * N3) {
        const strideOffset0 = _stride * N0;
        const strideOffset1 = _stride * N1;
        const strideOffset2 = _stride * N2;
        const v1 = [
          arrayBuffer[i + strideOffset0 + N0],
          arrayBuffer[i + strideOffset0 + N1],
          arrayBuffer[i + strideOffset0 + N2],
        ];
        const v2 = [
          arrayBuffer[i + strideOffset1 + N0],
          arrayBuffer[i + strideOffset1 + N1],
          arrayBuffer[i + strideOffset1 + N2],
        ];
        const v3 = [
          arrayBuffer[i + strideOffset2 + N0],
          arrayBuffer[i + strideOffset2 + N1],
          arrayBuffer[i + strideOffset2 + N2],
        ];
        calculateSurfaceNormal(v1, v2, v3, normal);
        arrayBuffer.set(normal, i + offset + strideOffset0);
        arrayBuffer.set(normal, i + offset + strideOffset1);
        arrayBuffer.set(normal, i + offset + strideOffset2);
      }
    }
  }

  protected _updateGeometryInfo(): void {
    super._updateGeometryInfo();
    this._indices = CUBE_DEFAULT_VERTICES;
    this._vertices = this._indiced
      ? CUBE_DEFAULT_VERTICES_INDICED
      : CUBE_DEFAULT_VERTICES;
    this._indicesBytes =
      this._indices *
      (this.indexFormat === "uint16" ? UINT16_BYTES : UINT32_BYTES);
    this._verticesBytes = this._vertices * this._strideBytes;
  }
}
