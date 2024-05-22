import {
  FLOAT32_BYTES,
  N0,
  N1,
  N2,
  PLANE_DEFAULT_DIVISIONS,
  PLANE_DEFAULT_HEIGHT,
  PLANE_DEFAULT_INDICES,
  PLANE_DEFAULT_STRIDE,
  PLANE_DEFAULT_VERTICES,
  PLANE_DEFAULT_WIDTH,
  PLANE_MIN_DIVISIONS,
  SQUARE_VERTICES,
  UINT16_BYTES,
  UINT32_BYTES,
} from "src/definitions";
import { assertExists } from "src/utils";

import { Geometry } from "./Geometry";
import { GeometryAttributes } from "./types";

const Z_0 = 0;
const backwardsNormal = [N0, N0, N1];

export class Plane extends Geometry {
  public width = PLANE_DEFAULT_WIDTH;
  public height = PLANE_DEFAULT_HEIGHT;
  protected _stride = PLANE_DEFAULT_STRIDE;
  protected _vertices = PLANE_DEFAULT_VERTICES;
  protected _indices = PLANE_DEFAULT_INDICES;
  protected _strideBytes = this._stride * FLOAT32_BYTES;
  protected _verticesBytes = this._vertices * this._strideBytes;
  protected _indicesBytes = this._indices * UINT16_BYTES;
  private _divisions = PLANE_DEFAULT_DIVISIONS;

  public get divisions(): number {
    return this._divisions;
  }

  public set divisions(divisions: number) {
    if (divisions < PLANE_MIN_DIVISIONS) {
      throw new Error(
        `Plane divisions must be greater than ${PLANE_MIN_DIVISIONS}`,
      );
    } else if (divisions % N1 > N0) {
      throw new Error("Plane divisions must be a whole number");
    }
    this._divisions = divisions;
    this._updateGeometryInfo();
  }

  public generateVertices(
    arrayBuffer: Float32Array,
    indexBuffer?: Uint16Array,
  ): void {
    const { divisions, width, height, _stride } = this;

    const minWidth = -width / N2;
    const minHeight = -height / N2;
    const incrementWidth = width / divisions;
    const incrementHeight = height / divisions;
    const planeResolution = divisions + N1;

    const verticesMap = new Map<number, number[]>();
    const uniqueVerticesCount = planeResolution * planeResolution;
    const addPosition = this._attributesMap.has(GeometryAttributes.position);
    const addNormal = this._attributesMap.has(GeometryAttributes.normal);
    for (let i = 0; i < uniqueVerticesCount; i++) {
      const x = minWidth + (i % planeResolution) * incrementWidth;
      const y = minHeight + Math.floor(i / planeResolution) * incrementHeight;
      const vertice: number[] = [];
      if (addPosition) {
        vertice.push(x, y, Z_0);
      }
      if (addNormal) {
        vertice.push(...backwardsNormal);
      }
      verticesMap.set(i, vertice);
    }

    let offset = N0;

    if (this._indiced) {
      assertExists(
        indexBuffer,
        `Index buffer must be provided for indiced geometry ${this.constructor.name}`,
      );
      const verticeIterator = verticesMap.values();
      for (const vertice of verticeIterator) {
        arrayBuffer.set(vertice, offset);
        offset += _stride;
      }
      offset = N0;
      for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
          const bli = i * planeResolution + j;
          const bri = bli + N1;
          const tli = bli + planeResolution;
          const tri = tli + N1;

          if (this.indiced) {
            indexBuffer[offset++] = tli;
            indexBuffer[offset++] = bli;
            indexBuffer[offset++] = bri;

            indexBuffer[offset++] = tli;
            indexBuffer[offset++] = bri;
            indexBuffer[offset++] = tri;
            continue;
          }
        }
      }
      return;
    }

    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        const bli = i * planeResolution + j;
        const bri = bli + N1;
        const tli = bli + planeResolution;
        const tri = tli + N1;

        const tl = verticesMap.get(tli)!;
        const bl = verticesMap.get(bli)!;
        const br = verticesMap.get(bri)!;
        const tr = verticesMap.get(tri)!;

        arrayBuffer.set(tl, offset);
        offset += _stride;
        arrayBuffer.set(bl, offset);
        offset += _stride;
        arrayBuffer.set(br, offset);
        offset += _stride;

        arrayBuffer.set(tl, offset);
        offset += _stride;
        arrayBuffer.set(br, offset);
        offset += _stride;
        arrayBuffer.set(tr, offset);
        offset += _stride;
      }
    }
  }

  protected _updateGeometryInfo(): void {
    super._updateGeometryInfo();
    this._indices = this._divisions * this._divisions * SQUARE_VERTICES;
    this._vertices = this.indiced
      ? (this._divisions + N1) * (this._divisions + N1)
      : this._indices;
    this._indicesBytes =
      this._indices *
      (this.indexFormat === "uint16" ? UINT16_BYTES : UINT32_BYTES);
    this._verticesBytes = this._vertices * this._strideBytes;
  }
}
