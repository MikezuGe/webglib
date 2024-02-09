export type UniformName =
  | "uTime"
  | "uDefaultColor"
  | "uView"
  | "uViewProjection"
  | "uModel";
export type TextureName = "tColor";
export type SamplerName = "sColor";

export type UniformType = "f32" | "mat4x4f" | "vec2f" | "vec3f" | "vec4f";
export type TextureType = "texture_2d<f32>";
export type SamplerType = "sampler";

export interface UniformWriterDescriptor {
  readonly name: UniformName;
  readonly offset: number;
}

export interface UniformDescriptor {
  readonly group: number;
  readonly binding: number;
  readonly bufferDescriptor: GPUBufferDescriptor;
  readonly writerDescriptors: UniformWriterDescriptor[];
}

export interface TextureDescriptor {
  readonly group: number;
  readonly binding: number;
  readonly name: TextureName;
  readonly samplerName: SamplerName;
}

export interface SamplerDescriptor {
  readonly group: number;
  readonly binding: number;
  readonly name: SamplerName;
}
