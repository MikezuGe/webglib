import type { BaseArgType } from "wgpu-matrix";

import type { CustomCanvas } from "../CustomCanvas";

// Helpers

export type AttributeName = "position" | "uv" | "color";
export type UniformName = "uTime" | "uCamera" | "uModel";
export interface UniformMemberNameMap {
  uCamera: "uView" | "uProjection";
}
export type TextureName = "tColor";
export type SamplerName = "sColor";

export type VertexFormatPicker<T extends GPUVertexFormat> = T;

// CustomCanvas

export interface IInitWebGPU {
  readonly adapter: GPUAdapter;
  readonly canvas: CustomCanvas;
  readonly context: GPUCanvasContext;
  readonly device: GPUDevice;
  readonly textureFormat: GPUTextureFormat;
}

interface FormatInfo {
  readonly bytes: number;
  readonly size: number;
}

export type VertexFormatInfo = FormatInfo;
export type IndexFormatInfo = FormatInfo;

// Shader

export interface ShaderVertexAttribute<T = string> {
  readonly name: T;
  readonly shaderLocation: number;
}

export type ShaderVertexAttributeMap<T extends string> = {
  readonly [K in T]: ShaderVertexAttribute<K>;
};

export interface UniformWriterDescriptor<U extends string, M extends object> {
  readonly name: U extends keyof M ? M[U] : U;
  readonly offset: number;
}

export interface UniformDescriptor<U extends string, M extends object> {
  readonly name: U;
  readonly group: number;
  readonly binding: number;
  readonly bufferDescriptor: GPUBufferDescriptor;
  readonly writerDescriptors: UniformWriterDescriptor<U, M>[];
}

export interface TextureDescriptor<T extends string> {
  readonly group: number;
  readonly binding: number;
  readonly name: T;
}

export interface SamplerDescriptor<S extends string> {
  readonly group: number;
  readonly binding: number;
  readonly name: S;
}

export type UniformBuffersByName<T extends string> = Record<T, GPUBuffer>;

export type BindGroupLayoutEntriesByGroup = Record<
  number,
  GPUBindGroupLayoutEntry[]
>;

export interface Shader<
  A extends string,
  U extends string,
  T extends string,
  S extends string,
  M extends object,
> {
  attributeMap: ShaderVertexAttributeMap<A>;
  uniformDescriptors: UniformDescriptor<U, M>[];
  textureDescriptors: TextureDescriptor<T>[];
  samplerDescriptors: SamplerDescriptor<S>[];
  vertexEntry: string;
  fragmentEntry: string;
  computeEntry: string;
  bindGroupLayoutEntriesByGroup: BindGroupLayoutEntriesByGroup;
}

export type BindGroupLayoutsByGroup = Record<number, GPUBindGroupLayout>;

// Supported vertex formats
export type VertexFormat = VertexFormatPicker<
  "float32" | "float32x2" | "float32x3" | "float32x4" | "unorm8x4"
>;

export interface VertexBufferData<A extends string> {
  data: number[];
  formats: VertexFormat[];
  attributes: A[];
  stepMode: GPUVertexStepMode;
}

export interface GeometryDescriptor<A extends string> {
  vertexBufferData: VertexBufferData<A>[];
  primitive: GPUPrimitiveState;
  indices?: number[];
}

export interface GeometryRequired {
  drawCount: number;
  primitive: GPUPrimitiveState;
  vertexBuffers: GPUBuffer[];
  vertexBufferLayout: GPUVertexBufferLayout[];
}

export interface GeometryPartial {
  indexBuffer: GPUBuffer;
  indexFormat: GPUIndexFormat;
}

export type Geometry = GeometryRequired & AllOrNone<GeometryPartial>;

export type ViewDataSetter = (dataOffset: number, bufferOffset: number) => void;

export interface GeometryStride {
  stride: number;
  strideBytes: number;
}

// Transform

export interface TransformJSON {
  readonly position?: BaseArgType;
  readonly rotationOriginAxis?: BaseArgType;
  readonly rotationOriginScale?: number;
  readonly origin?: BaseArgType;
  readonly rotationCenterAxis?: BaseArgType;
  readonly rotationCenterScale?: number;
  readonly scale?: BaseArgType;
}

// Renderer

// export interface Renderable {
// renderPipeline: GPURenderPipeline;
// vertexBuffers: GPUBuffer[];
// indexBuffer?: GPUBuffer;
// indexFormat?: GPUIndexFormat;
// drawCount: number;
// textureBindGroupIndex: number;
// textureBindGroup: GPUBindGroup;
// modelBindGroupIndex: number;
// modelBindGroups: GPUBindGroup[];
// }

export interface Renderable {
  renderPipeline: GPURenderPipeline;
  vertexBuffers: GPUBuffer[];
  indexBuffer?: GPUBuffer;
  indexFormat?: GPUIndexFormat;
  drawCount: number;
  textureBindGroupIndex: number;
  modelBindGroupIndex: number;
  textureBindGroups: {
    textureBindGroup: GPUBindGroup;
    modelBindGroups: GPUBindGroup[];
  }[];
}
