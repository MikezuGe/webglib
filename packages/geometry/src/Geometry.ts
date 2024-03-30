import { getBytesFromFormat, getSizeFromFormat } from "@webglib/util";
import type { IAttribute } from "@webglib/types";

const zero = 0;

const attributeFormatMap: Readonly<Record<IAttribute, GPUVertexFormat>> = {
  color: "float32x3",
  normal: "float32x3",
  position: "float32x3",
};

export class Geometry {
  public primitive: GPUPrimitiveState = {
    cullMode: "back",
    topology: "triangle-list",
    frontFace: "ccw",
  };
  protected readonly _attributes = new Map<IAttribute, GPUVertexAttribute>();
  protected _verticesCount = zero;
  protected _strideCount = zero;
  private _verticesBytes = zero;
  private _strideBytes = zero;

  public get verticesCount(): number {
    return this._verticesCount;
  }

  public get verticesBytes(): number {
    return this._verticesBytes;
  }

  public get strideCount(): number {
    return this._strideCount;
  }

  public get strideBytes(): number {
    return this._strideBytes;
  }

  public get attributes(): IAttribute[] {
    return Array.from(this._attributes.keys());
  }

  public get vertexAttributes(): GPUVertexAttribute[] {
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

  /**
   * @example
   * const cube = new Cube();
   * cube.useAttributes({ position: 0 });
   *
   * // Creates a new Float32Array with the vertices data
   * const vertices = cube.generateVertices();
   * // Or use an existing Float32Array
   * const vertices = new Float32Array(cube.verticesCount * cube.strideCount);
   * cube.generateVertices(vertices);
   *
   * @param _targetBuffer
   */
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, @typescript-eslint/no-unused-vars
  public generateVertices(_targetBuffer: Float32Array): void {
    throw new Error("Method not implemented.");
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
    this._strideCount = stride;
    this._strideBytes = strideBytes;
    this._verticesBytes = this._strideBytes * this._verticesCount;
  }
}
