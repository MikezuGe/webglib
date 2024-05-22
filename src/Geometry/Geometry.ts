import { FLOAT32_BYTES, N3 } from "src/definitions";

import { GeometryAttributes } from "./types";

export abstract class Geometry {
  public indexFormat: GPUIndexFormat = "uint16";
  public readonly primitive: GPUPrimitiveState = {
    topology: "triangle-list",
    frontFace: "ccw",
    cullMode: "back",
  };
  protected _indiced = true;
  protected readonly _attributesMap = new Map<GeometryAttributes, true>([
    [GeometryAttributes.position, true],
  ]);
  private readonly _attributes: GPUVertexAttribute[] = [];

  protected abstract _stride: number;
  protected abstract _vertices: number;
  protected abstract _indices: number;
  protected abstract _strideBytes: number;
  protected abstract _verticesBytes: number;
  protected abstract _indicesBytes: number;

  public get stride(): number {
    return this._stride;
  }

  public get strideBytes(): number {
    return this._strideBytes;
  }

  public get vertices(): number {
    return this._vertices;
  }

  public get verticesBytes(): number {
    return this._verticesBytes;
  }

  public get indicesBytes(): number {
    return this._indicesBytes;
  }

  public get indices(): number {
    return this._indices;
  }

  public get drawCount(): number {
    return this._indices;
  }

  public get indiced(): boolean {
    return this._indiced;
  }

  public set indiced(value: boolean) {
    this._indiced = value;
  }

  public get attributes(): GPUVertexAttribute[] {
    return this._attributes;
  }

  public enableAttributes(attributes: GeometryAttributes[]): void {
    for (const attribute of attributes) {
      this._attributesMap.set(attribute, true);
    }
    this._updateGeometryInfo();
  }

  public disableAttributes(attributes: GeometryAttributes[]): void {
    for (const attribute of attributes) {
      this._attributesMap.delete(attribute);
    }
    this._updateGeometryInfo();
  }

  protected _updateGeometryInfo(): void {
    let stride = 0;
    let strideBytes = 0;
    this._attributes.length = 0;

    let offset = 0;
    if (this._attributesMap.has(GeometryAttributes.position)) {
      stride += N3;
      strideBytes += N3 * FLOAT32_BYTES;
      this._attributes.push({
        format: "float32x3",
        offset,
        shaderLocation: this._attributes.length,
      });
      offset += N3 * FLOAT32_BYTES;
    }
    if (this._attributesMap.has(GeometryAttributes.normal)) {
      stride += N3;
      strideBytes += N3 * FLOAT32_BYTES;
      this._attributes.push({
        format: "float32x3",
        offset,
        shaderLocation: this._attributes.length,
      });
      offset += N3 * FLOAT32_BYTES;
    }

    this._stride = stride;
    this._strideBytes = strideBytes;
  }

  public abstract generateVertices(
    arrayBuffer?: Float32Array,
    indexBuffer?: Uint16Array | Uint32Array,
  ): void;
}
