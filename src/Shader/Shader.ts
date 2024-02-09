import type { Geometry } from "src/Geometry";

export class Shader {
  public readonly renderPipeline: GPURenderPipeline;
  private readonly _shaderModule: GPUShaderModule;
  private readonly _code: string;

  public constructor({
    code,
    geometry,
    textureFormat,
    device,
  }: {
    code: string;
    geometry: Geometry;
    textureFormat: GPUTextureFormat;
    device: GPUDevice;
  }) {
    this._code = code;
    this._shaderModule = device.createShaderModule({ code: this._code });
    this.renderPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: this._shaderModule,
        buffers: [
          {
            arrayStride: geometry.strideBytes,
            attributes: [
              {
                format: "float32x3",
                offset: 0,
                shaderLocation: 0,
              },
            ],
            stepMode: "vertex",
          },
        ],
        entryPoint: "vertex_main",
      },
      fragment: {
        module: this._shaderModule,
        entryPoint: "fragment_main",
        targets: [{ format: textureFormat }],
      },
      primitive: geometry.primitive,
    });
  }
}
