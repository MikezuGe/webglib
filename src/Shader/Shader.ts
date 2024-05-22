import type { Geometry } from "src/Geometry";
import { ReadinessState } from "src/utils";

import { UniformGroup } from "./UniformGroup";
import type { UniformDefinitionMap } from "./types";

interface ShaderOptions<T extends UniformDefinitionMap> {
  code: string;
  geometry: Geometry;
  uniformDefinitions: T;
}

export class Shader<
  T extends UniformDefinitionMap,
  K extends Extract<keyof T, string>,
> {
  private readonly _code: string;
  private readonly _geometry: Geometry;
  private readonly _uniformDefinitions: T;
  private readonly _uniformBufferCreators = new Map<
    string,
    <U extends K>() => UniformGroup<T[U]>
  >();
  private readonly _state = new ReadinessState();
  private _renderPipeline?: GPURenderPipeline;

  public constructor({ code, geometry, uniformDefinitions }: ShaderOptions<T>) {
    this._code = code;
    this._geometry = geometry;
    this._uniformDefinitions = uniformDefinitions;
  }

  public get renderPipeline(): GPURenderPipeline {
    this._state.isStateOrThrow(ReadinessState.initialized);
    return this._renderPipeline!;
  }

  public setup(device: GPUDevice, textureFormat: GPUTextureFormat): void {
    this._state.isStateOrThrow(ReadinessState.uninitialized);
    this._state.setState(ReadinessState.preparing);

    const shaderModule = device.createShaderModule({ code: this._code });
    this._renderPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule,
        buffers: [
          {
            arrayStride: this._geometry.strideBytes,
            attributes: this._geometry.attributes,
            stepMode: "vertex",
          },
        ],
        entryPoint: "vertex_main",
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [{ format: textureFormat }],
      },
      primitive: this._geometry.primitive,
    });

    for (const name in this._uniformDefinitions) {
      const uniformDefinition = this._uniformDefinitions[name];
      this._uniformBufferCreators.set(name, <U extends K>() => {
        const uniformGroup = new UniformGroup(uniformDefinition as T[U]);
        uniformGroup.setup(device, this._renderPipeline!);
        return uniformGroup;
      });
    }

    this._state.setState(ReadinessState.initialized);
  }

  public createUniformGroup<U extends K>(name: U): UniformGroup<T[U]> {
    return this._uniformBufferCreators.get(name)!();
  }
}
