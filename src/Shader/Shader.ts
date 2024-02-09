import { WgslReflect } from "wgsl_reflect";

import { N1 } from "../definitions";
import type {
  SamplerDescriptor,
  SamplerName,
  TextureDescriptor,
  TextureName,
  UniformDescriptor,
  UniformName,
  UniformWriterDescriptor,
} from "../types";
import { assertExists, loadAsset } from "../utils";

export class Shader {
  private _renderReady = false;
  private _code?: string;

  private _uniformDescriptors: UniformDescriptor[] = [];
  private readonly _uniformDescriptorsByName = new Map<
    UniformName,
    UniformDescriptor
  >();
  private readonly _samplerDescriptorsByName = new Map<
    SamplerName,
    SamplerDescriptor
  >();
  private readonly _textureDescriptorsByName = new Map<
    TextureName,
    TextureDescriptor
  >();

  public get renderReady(): boolean {
    return this._renderReady;
  }

  public get code(): string | undefined {
    return this._code;
  }

  public get uniformDescriptors(): readonly UniformDescriptor[] {
    return this._uniformDescriptors;
  }

  public static fromJSON(name: string): Shader {
    const shader = new Shader();
    void Shader.load(shader, name);
    return shader;
  }

  public static async load(shader: Shader, name: string): Promise<void> {
    const json = await loadAsset("shader", name, "json");
    const code = await loadAsset("shaderCode", json.code, "wgsl");
    shader._code = code;
    const { uniformDescriptors, textureDescriptors, samplerDescriptors } =
      Shader._codeToDescriptors(code);

    shader._uniformDescriptors = uniformDescriptors;
    for (const uniformDescriptor of uniformDescriptors) {
      for (const writerDescriptor of uniformDescriptor.writerDescriptors) {
        shader._uniformDescriptorsByName.set(
          writerDescriptor.name,
          uniformDescriptor,
        );
      }
    }

    for (const textureDescriptor of textureDescriptors) {
      shader._textureDescriptorsByName.set(
        textureDescriptor.name,
        textureDescriptor,
      );
    }

    for (const samplerDescriptor of samplerDescriptors) {
      shader._samplerDescriptorsByName.set(
        samplerDescriptor.name,
        samplerDescriptor,
      );
    }

    shader._renderReady = true;
  }

  private static _codeToDescriptors(code: string): {
    uniformDescriptors: UniformDescriptor[];
    textureDescriptors: TextureDescriptor[];
    samplerDescriptors: SamplerDescriptor[];
  } {
    const reflect = new WgslReflect(code);

    const uniformDescriptors: UniformDescriptor[] = [];
    const usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
    for (const u of reflect.uniforms) {
      const { group, binding, members } = u;
      const bufferDescriptor: GPUBufferDescriptor = { size: 0, usage };
      const writerDescriptors: UniformWriterDescriptor[] = [];
      if (members) {
        const { size } = u;
        bufferDescriptor.size = size;
        for (const { name, offset } of members) {
          writerDescriptors.push({ name: name as UniformName, offset });
        }
      } else {
        const { name, size } = u;
        bufferDescriptor.size = size;
        writerDescriptors.push({ name: name as UniformName, offset: 0 });
      }
      uniformDescriptors.push({
        group,
        binding,
        bufferDescriptor,
        writerDescriptors,
      });
    }

    const textureDescriptors: TextureDescriptor[] = [];
    for (const t of reflect.textures) {
      const { group, binding, name } = t;
      const samplerName = `s${/t(\w+)/.exec(name)![N1]}` as SamplerName;
      textureDescriptors.push({
        group,
        binding,
        name: name as TextureName,
        samplerName,
      });
    }

    const samplerDescriptors: SamplerDescriptor[] = [];
    for (const s of reflect.samplers) {
      const { group, binding, name } = s;
      samplerDescriptors.push({ group, binding, name: name as SamplerName });
    }

    return { uniformDescriptors, textureDescriptors, samplerDescriptors };
  }

  public getUniformDescriptor(name: UniformName): UniformDescriptor {
    const uniformDescriptor = this._uniformDescriptorsByName.get(name);
    assertExists(
      uniformDescriptor,
      `Uniform descriptor '${name}' not supported by shader`,
    );
    return uniformDescriptor;
  }

  public getTextureDescriptor(name: TextureName): TextureDescriptor {
    const textureDescriptor = this._textureDescriptorsByName.get(name);
    assertExists(
      textureDescriptor,
      `Texture descriptor '${name}' not supported by shader`,
    );
    return textureDescriptor;
  }

  public getSamplerBinding(name: SamplerName): SamplerDescriptor {
    const samplerDescriptor = this._samplerDescriptorsByName.get(name);
    assertExists(
      samplerDescriptor,
      `Sampler descriptor '${name}' not supported by shader`,
    );
    return samplerDescriptor;
  }
}
