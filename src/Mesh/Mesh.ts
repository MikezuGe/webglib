import type { Geometry } from "src/Geometry";

enum MeshState {
  initialized = "initialized",
  uninitialized = "uninitialized",
}

export class Mesh<T extends Geometry = never> {
  public indexFormat: GPUIndexFormat = "uint16";
  private _geometry?: T = undefined;
  private _vertexBuffer?: GPUBuffer = undefined;
  private _indexBuffer?: GPUBuffer = undefined;
  private _state = MeshState.uninitialized;

  public constructor(geometry?: T) {
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
    if (this._state === MeshState.initialized) {
      throw new Error("Mesh is already initialized");
    }

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
        this.indexFormat === "uint16"
          ? new Uint16Array(this._indexBuffer.getMappedRange())
          : new Uint32Array(this._indexBuffer.getMappedRange())
      );
      this._indexBuffer.unmap();
    } else {
      this._geometry!.generateVertices(
        new Float32Array(this._vertexBuffer.getMappedRange())
      );
    }
    this._vertexBuffer.unmap();

    this._state = MeshState.initialized;
  }
}
