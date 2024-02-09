import { N0 } from "../definitions";
import type { AttributeName } from "../types";
import {
  getAttributeInfo,
  getIndexFormatInfo,
  getVertexFormatInfo,
  loadAsset,
} from "../utils";

export class Geometry {
  private _renderReady = false;
  private _vertices: DeepReadonly<number[][]> = [];
  private _indices?: Uint16Array | Uint32Array;
  private _attributes: DeepReadonly<AttributeName[][]> = [];
  private _stepModes: GPUVertexStepMode[] = [];
  private _indexFormat?: GPUIndexFormat;
  private _primitive?: Readonly<GPUPrimitiveState>;

  private _vertexBufferLayout: readonly GPUVertexBufferLayout[] = [];
  private _vertexBuffersBytes: readonly number[] = [];
  private _indiceCount = N0;
  private _indiceBytes = N0;
  private _drawCount = N0;

  public get renderReady(): boolean {
    return this._renderReady;
  }

  public get vertices(): DeepReadonly<number[][]> {
    return this._vertices;
  }

  public get indices(): Uint16Array | Uint32Array | undefined {
    return this._indices;
  }

  public get attributes(): DeepReadonly<AttributeName[][]> {
    return this._attributes;
  }

  public get stepModes(): GPUVertexStepMode[] {
    return this._stepModes;
  }

  public get indexFormat(): GPUIndexFormat {
    return this._indexFormat!;
  }

  public get primitive(): Readonly<GPUPrimitiveState> {
    return this._primitive!;
  }

  public get vertexBufferLayout(): readonly Readonly<GPUVertexBufferLayout>[] {
    return this._vertexBufferLayout;
  }

  public get vertexBuffersBytes(): readonly number[] {
    return this._vertexBuffersBytes;
  }

  public get indiceCount(): number {
    return this._indiceCount;
  }

  public get indiceBytes(): number {
    return this._indiceBytes;
  }

  public get drawCount(): number {
    return this._drawCount;
  }

  public static fromJSON(name: string): Geometry {
    const geometry = new Geometry();
    void Geometry.load(geometry, name);
    return geometry;
  }

  public static async load(geometry: Geometry, name: string): Promise<void> {
    const { attributes, primitive, stepModes, vertices, indexFormat, indices } =
      await loadAsset("geometry", name, "json");
    geometry._vertices = vertices;
    geometry._attributes = attributes;
    geometry._stepModes = stepModes;
    geometry._primitive = primitive;
    geometry._indexFormat = indexFormat ?? "uint16";
    if (indices) {
      geometry._indices =
        geometry._indexFormat === "uint16"
          ? new Uint16Array(indices)
          : new Uint32Array(indices);
    }
    geometry._updateGeometryInfo();
    geometry._renderReady = true;
  }

  protected _updateGeometryInfo({
    verticeCount,
    indiceCount,
  }: {
    verticeCount?: number;
    indiceCount?: number;
  } = {}): void {
    const { _vertices, _indices, _attributes, _stepModes, _indexFormat } = this;

    const vertexBufferLayout: GPUVertexBufferLayout[] = [];
    const vertexBuffersBytes: number[] = [];
    let i = 0;
    for (const attributes of _attributes) {
      const vertexAttributes: GPUVertexAttribute[] = [];
      let strideBytes = 0;
      let strideCount = 0;
      for (const attribute of attributes) {
        const { format, shaderLocation } = getAttributeInfo(attribute);
        const { bytes, size } = getVertexFormatInfo(format);
        vertexAttributes.push({
          format,
          offset: strideBytes,
          shaderLocation,
        });
        strideBytes += bytes;
        strideCount += size;
      }
      vertexBufferLayout.push({
        attributes: vertexAttributes,
        arrayStride: strideBytes,
        stepMode: _stepModes[i],
      });
      vertexBuffersBytes.push(
        (_vertices[i].length / strideCount) * strideBytes,
      );
      i++;
    }

    const index = vertexBufferLayout.findIndex(
      (layout) => layout.stepMode === "vertex",
    );

    verticeCount ??=
      vertexBuffersBytes[index] / vertexBufferLayout[index].arrayStride;
    indiceCount ??= _indices?.length ?? N0;
    const drawCount = indiceCount || verticeCount;
    const indiceBytes = indiceCount * getIndexFormatInfo(_indexFormat!).bytes;

    this._indiceCount = indiceCount;
    this._indiceBytes = indiceBytes;
    this._drawCount = drawCount;
    this._vertexBufferLayout = vertexBufferLayout;
    this._vertexBuffersBytes = vertexBuffersBytes;
  }
}
