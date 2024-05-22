export interface BufferDefinition {
  binding: number;
  offset: number;
  size: number;
}

export type BufferDefinitionMap = Record<string, BufferDefinition>;

export interface UniformDefinition {
  bindGroupIndex: number;
  bufferDefinitions: BufferDefinitionMap;
}

export type UniformDefinitionMap = Record<string, UniformDefinition>;

export interface BindGroupDescriptor {
  name: string;
  uniformDescriptor: GPUBufferDescriptor;
  binding: number;
  offset: number;
  size: number;
}

export interface BufferDescriptor {
  bindGroupIndex: number;
  entries: BindGroupDescriptor[];
}

export interface UniformGroupWriter {
  name: string;
  offset: number;
}

export interface UniformGroupDefinition {
  binding: number;
  size: number;
  writers: UniformGroupWriter[];
}
