import {
  FLOAT_BYTES,
  ONE,
  PLANE_MIN_DIVISIONS,
  SQUARE_VERTICES,
  TWO,
  UINT_BYTES,
  ZERO,
} from "src/definitions";
import { Geometry } from "./Geometry";
import { assertExists } from "src/utils";

const TEMP_STRIDE = 3;
const TEMP_VERTICES = 6;
const Z_0 = 0;

export class Plane extends Geometry {
  public width = ONE;
  public height = ONE;
  protected _stride = TEMP_STRIDE;
  protected _vertices = TEMP_VERTICES;
  protected _indices = this._vertices;
  protected _strideBytes = this._stride * FLOAT_BYTES;
  protected _verticesBytes = this._vertices * this._strideBytes;
  protected _indicesBytes = this._indices * UINT_BYTES;
  private _divisions = ONE;

  public get divisions(): number {
    return this._divisions;
  }

  public set divisions(divisions: number) {
    if (divisions < PLANE_MIN_DIVISIONS) {
      throw new Error(
        `Plane divisions must be greater than ${PLANE_MIN_DIVISIONS}`
      );
    } else if (divisions % ONE > ZERO) {
      throw new Error("Plane divisions must be a whole number");
    }
    this._divisions = divisions;
    this.updateGeometryInfo();
  }

  public generateVertices(
    arrayBuffer: Float32Array,
    indexBuffer?: Uint16Array | Uint32Array
  ): void {
    const { divisions, width, height, _stride } = this;

    const minWidth = -width / TWO;
    const minHeight = -height / TWO;
    const incrementWidth = width / divisions;
    const incrementHeight = height / divisions;
    const planeResolution = divisions + ONE;

    const verticesMap = new Map<number, number[]>();
    const uniqueVerticesCount = planeResolution * planeResolution;
    for (let i = 0; i < uniqueVerticesCount; i++) {
      const x = minWidth + (i % planeResolution) * incrementWidth;
      const y = minHeight + Math.floor(i / planeResolution) * incrementHeight;
      verticesMap.set(i, [x, y, Z_0]);
    }

    let index = 0;

    if (this._indiced) {
      assertExists(
        indexBuffer,
        `Index buffer must be provided for indiced geometry ${this.constructor.name}`
      );
      const verticeIterator = verticesMap.values();
      for (const vertice of verticeIterator) {
        arrayBuffer.set(vertice, index);
        index += _stride;
      }
      index = ZERO;
      for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
          const bli = i * planeResolution + j;
          const bri = bli + ONE;
          const tli = bli + planeResolution;
          const tri = tli + ONE;

          if (this.indiced) {
            indexBuffer[index++] = tli;
            indexBuffer[index++] = bli;
            indexBuffer[index++] = bri;

            indexBuffer[index++] = tli;
            indexBuffer[index++] = bri;
            indexBuffer[index++] = tri;
            continue;
          }
        }
      }
      return;
    }

    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        const bli = i * planeResolution + j;
        const bri = bli + ONE;
        const tli = bli + planeResolution;
        const tri = tli + ONE;

        const tl = verticesMap.get(tli)!;
        const tr = verticesMap.get(tri)!;
        const bl = verticesMap.get(bli)!;
        const br = verticesMap.get(bri)!;

        arrayBuffer.set(tl, index);
        index += _stride;
        arrayBuffer.set(bl, index);
        index += _stride;
        arrayBuffer.set(br, index);
        index += _stride;

        arrayBuffer.set(tl, index);
        index += _stride;
        arrayBuffer.set(br, index);
        index += _stride;
        arrayBuffer.set(tr, index);
        index += _stride;
      }
    }
  }

  protected updateGeometryInfo(): void {
    this._indices = this._divisions * this._divisions * SQUARE_VERTICES;
    this._vertices = this.indiced
      ? (this._divisions + ONE) * (this._divisions + ONE)
      : this._indices;
    this._indicesBytes = this._indices * UINT_BYTES;
    this._verticesBytes = this._vertices * this._strideBytes;
  }
}
