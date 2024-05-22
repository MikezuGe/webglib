import type { Geometry } from "src/Geometry";
import { ReadinessState, assertExists } from "src/utils";

export class Mesh<T extends Geometry = never> {
  private _geometry?: T;
  private _vertexBuffer?: GPUBuffer;
  private _indexBuffer?: GPUBuffer;
  private readonly _state = new ReadinessState();

  public constructor(geometry?: T) {
    assertExists(geometry, "Geometry must be provided");
    this._geometry = geometry;
  }

  public get geometry(): T {
    return this._geometry!;
  }

  public set geometry(geometry: T) {
    if (this._geometry) {
      throw new Error("Geometry already set");
    }
    this._geometry = geometry;
  }

  public get vertexBuffer(): GPUBuffer {
    return this._vertexBuffer!;
  }

  public get indexBuffer(): GPUBuffer {
    return this._indexBuffer!;
  }

  public setupBuffers(device: GPUDevice): void {
    this._state.isStateOrThrow(ReadinessState.uninitialized);
    this._state.setState(ReadinessState.preparing);

    this._vertexBuffer = device.createBuffer({
      size: this._geometry!.verticesBytes,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    if (this._geometry!.indiced) {
      this._indexBuffer = device.createBuffer({
        size: this._geometry!.indicesBytes,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
      });
      this._geometry!.generateVertices(
        new Float32Array(this._vertexBuffer.getMappedRange()),
        this._geometry?.indexFormat === "uint16"
          ? new Uint16Array(this._indexBuffer.getMappedRange())
          : new Uint32Array(this._indexBuffer.getMappedRange()),
      );
      this._indexBuffer.unmap();
    } else {
      this._geometry!.generateVertices(
        new Float32Array(this._vertexBuffer.getMappedRange()),
      );
    }
    this._vertexBuffer.unmap();

    this._state.setState(ReadinessState.initialized);
  }
}
