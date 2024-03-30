import type { Geometry } from "@webglib/geometry";
import type { IAttribute } from "@webglib/types";
import { PREFERRED_CANVAS_FORMAT } from "./definitions";

const hashString = async (message: string): Promise<string> => {
  const sixteen = 16;
  const two = 2;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(sixteen).padStart(two, "0"))
    .join("");
};

export class Shader {
  private static readonly _shaderMap = new Map<string, Shader>();
  private readonly _device: GPUDevice;
  private readonly _shaderKey: string;
  private readonly _shaderModule: GPUShaderModule;

  private constructor({
    device,
    code,
    shaderKey,
  }: {
    device: GPUDevice;
    shaderKey: string;
    code: string;
  }) {
    this._device = device;
    this._shaderKey = shaderKey;
    this._shaderModule = device.createShaderModule({ code });
    Shader._shaderMap.set(shaderKey, this);
  }

  public get shaderKey(): string {
    return this._shaderKey;
  }

  public static create = async (
    device: GPUDevice,
    attributes: IAttribute[],
    code: string
  ): Promise<Shader> => {
    const shaderKey = await Shader.createShaderKey(attributes, code);
    const storedShader = Shader._shaderMap.get(shaderKey);
    if (storedShader) {
      return storedShader;
    }
    return new Shader({
      device,
      shaderKey,
      code,
    });
  };

  private static async createShaderKey(
    attributes: IAttribute[],
    code: string
  ): Promise<string> {
    const codeHash = await hashString(code);
    const attributesHash = await hashString(
      attributes.map((a) => a.toUpperCase()).join("")
    );
    return `${codeHash}_${attributesHash}`;
  }

  public createRenderPipeline = (geometry: Geometry): GPURenderPipeline => {
    return this._device.createRenderPipeline({
      vertex: {
        module: this._shaderModule,
        entryPoint: "vertex_main",
        buffers: [
          {
            stepMode: "vertex",
            arrayStride: geometry.strideBytes,
            attributes: geometry.vertexAttributes,
          },
        ],
      },
      fragment: {
        module: this._shaderModule,
        entryPoint: "fragment_main",
        targets: [{ format: PREFERRED_CANVAS_FORMAT }],
      },
      primitive: geometry.primitive,
      layout: "auto",
    });
  };
}
