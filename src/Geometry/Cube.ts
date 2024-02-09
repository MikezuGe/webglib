import {
  FLOAT_BYTES,
  CUBE_INDICED_VERTICES,
  CUBE_VERTICES,
  UINT_BYTES,
} from "src/definitions";
import { Geometry } from "./Geometry";

const TEMP_STRIDE = 3;
const X_L = -1;
const X_R = 1;
const Y_T = 1;
const Y_B = -1;
const Z_F = 1;
const Z_B = -1;

export class Cube extends Geometry {
  protected _stride = TEMP_STRIDE;
  protected _vertices = CUBE_VERTICES;
  protected _indices = this._vertices;
  protected _strideBytes = this._stride * FLOAT_BYTES;
  protected _verticesBytes = this._vertices * this._strideBytes;
  protected _indicesBytes = this._indices * UINT_BYTES;

  public generateVertices(
    arrayBuffer = new Float32Array(CUBE_VERTICES * this._stride),
    indexBuffer?: Uint16Array | Uint32Array
  ): void {
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
      for (let i = 0; i < CUBE_VERTICES; i++) {
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
    // prettier-ignore
    arrayBuffer.set([
      // front
      X_L, Y_T, Z_F,
      X_L, Y_B, Z_F,
      X_R, Y_B, Z_F,
      X_L, Y_T, Z_F,
      X_R, Y_B, Z_F,
      X_R, Y_T, Z_F,
      // right
      X_R, Y_T, Z_F,
      X_R, Y_B, Z_F,
      X_R, Y_B, Z_B,
      X_R, Y_T, Z_F,
      X_R, Y_B, Z_B,
      X_R, Y_T, Z_B,
      // back
      X_R, Y_T, Z_B,
      X_R, Y_B, Z_B,
      X_L, Y_B, Z_B,
      X_R, Y_T, Z_B,
      X_L, Y_B, Z_B,
      X_L, Y_T, Z_B,
      // left
      X_L, Y_T, Z_B,
      X_L, Y_B, Z_B,
      X_L, Y_B, Z_F,
      X_L, Y_T, Z_B,
      X_L, Y_B, Z_F,
      X_L, Y_T, Z_F,
      // top
      X_L, Y_T, Z_B,
      X_L, Y_T, Z_F,
      X_R, Y_T, Z_F,
      X_L, Y_T, Z_B,
      X_R, Y_T, Z_F,
      X_R, Y_T, Z_B,
      // bottom
      X_L, Y_B, Z_F,
      X_L, Y_B, Z_B,
      X_R, Y_B, Z_B,
      X_L, Y_B, Z_F,
      X_R, Y_B, Z_B,
      X_R, Y_B, Z_F,
    ]);
  }

  protected updateGeometryInfo(): void {
    this._indices = CUBE_VERTICES;
    this._vertices = this._indiced ? CUBE_INDICED_VERTICES : CUBE_VERTICES;
    this._indicesBytes = this._indices * UINT_BYTES;
    this._verticesBytes = this._vertices * this._strideBytes;
  }
}
