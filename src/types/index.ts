import type { BaseArgType } from "wgpu-matrix";

import type { CustomCanvas } from "../CustomCanvas";
import type { Transform } from "../Transform";

import type { TextureName, UniformName } from "./shader";

export * from "./shader";

export interface IInitWebGPU {
  adapter: GPUAdapter;
  canvas: CustomCanvas;
  context: GPUCanvasContext;
  device: GPUDevice;
  textureFormat: GPUTextureFormat;
}

export type AttributeName = "normal" | "position" | "uv";

export interface AttributeInfo {
  readonly format: GPUVertexFormat;
  readonly shaderLocation: GPUIndex32;
}

interface FormatInfo {
  readonly bytes: number;
  readonly size: number;
  readonly type: string;
}

export type VertexFormatInfo = FormatInfo;
export type IndexFormatInfo = FormatInfo;
export type UniformTypeInfo = FormatInfo;
export type TextureFormatInfo = FormatInfo;

export interface GeometryJSON {
  readonly attributes: AttributeName[][];
  readonly stepModes: GPUVertexStepMode[];
  readonly primitive: GPUPrimitiveState;
  readonly vertices: number[][];
  readonly indices?: number[];
  readonly indexFormat?: GPUIndexFormat;
}

export interface TextureInfo {
  readonly filename: string;
  readonly format: GPUTextureFormat;
  readonly type: TextureName;
}

export interface MaterialJSON {
  readonly textures: TextureInfo[];
}

export interface ShaderJSON {
  readonly code: string;
}

export interface MeshJSON {
  readonly shader: string;
  readonly geometry: string;
  readonly material: string;
}

export interface ModelJSON {
  readonly meshes: string[];
}

export interface TransformJSON {
  readonly position?: BaseArgType;
  readonly rotationOriginAxis?: BaseArgType;
  readonly rotationOriginScale?: number;
  readonly origin?: BaseArgType;
  readonly rotationCenterAxis?: BaseArgType;
  readonly rotationCenterScale?: number;
  readonly scale?: BaseArgType;
}

export interface GameObjectJSON {
  readonly model: string;
  readonly transform?: TransformJSON;
}

export interface SceneJSON {
  readonly gameObjects: string[];
}

export interface Texture {
  readonly type: TextureName;
  readonly source: ImageBitmap;
  readonly format: GPUTextureFormat;
  readonly size: GPUExtent3D;
}

export interface BindingGroup {
  readonly bindGroup: GPUBindGroup;
  readonly bindGroupIndex: number;
}

export interface UniformWriter {
  readonly buffer: GPUBuffer;
  readonly offset: number;
}

export type UniformWriters = Partial<Record<UniformName, UniformWriter>>;
export type BindingGroups = Partial<Record<UniformName, BindingGroup>>;

export interface Renderable {
  readonly vertexBuffers: GPUBuffer[];
  readonly indexBuffer?: GPUBuffer;
  readonly indexFormat: GPUIndexFormat;
  readonly drawCount: number;
  readonly renderPipeline: GPURenderPipeline;
  readonly bindingGroups: BindingGroup[];
  readonly uniformWriters: Omit<UniformWriters, "uModel">;
  transforms: {
    transform: Transform;
    bindingGroup: BindingGroup;
    uniformWriter: UniformWriter;
  }[];
}

declare global {
  export type DeepReadonly<T> = Readonly<
    T extends (infer R)[] ? DeepReadonly<R>[] : T
  >;
}
