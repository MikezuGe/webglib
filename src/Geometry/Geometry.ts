export enum GeometryAttributes {
  position = "position",
  normal = "normal",
}

export abstract class Geometry {
  public readonly primitive: GPUPrimitiveState = {
    topology: "triangle-list",
    frontFace: "ccw",
    cullMode: "back",
  };
  protected _indiced = false;
  protected readonly _attributes = new Map<GeometryAttributes, true>();

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
    this.updateGeometryInfo();
  }

  public enableAttributes(attributes: GeometryAttributes[]): void {
    for (const attribute of attributes) {
      this._attributes.set(attribute, true);
    }
    this.updateGeometryInfo();
  }

  public disableAttributes(attributes: GeometryAttributes[]): void {
    for (const attribute of attributes) {
      this._attributes.delete(attribute);
    }
    this.updateGeometryInfo();
  }

  public abstract generateVertices(
    arrayBuffer?: Float32Array,
    indexBuffer?: Uint16Array | Uint32Array
  ): void;

  protected abstract updateGeometryInfo(): void;
}
