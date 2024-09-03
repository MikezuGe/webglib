import { WgslReflect } from "wgsl_reflect";

import { N0 } from "./definitions";

interface VertexAttribute<T = string> {
  readonly name: T;
  readonly shaderLocation: number;
}

export type AttributeMap<T extends string | number | symbol = string> = {
  readonly [K in T]: VertexAttribute<K>;
};

export type UniformName = "uTime" | "uView" | "uProjection" | "uModel";
export type TextureName = "tColor";
export type SamplerName = "sColor";

export interface UniformWriterDescriptor {
  readonly name: UniformName;
  readonly offset: number;
}

export interface UniformDescriptor {
  readonly name: UniformName;
  readonly group: number;
  readonly binding: number;
  readonly bufferDescriptor: GPUBufferDescriptor;
  readonly writerDescriptors: UniformWriterDescriptor[];
}

export interface TextureDescriptor {
  readonly group: number;
  readonly binding: number;
  readonly name: TextureName;
  // readonly samplerName: string;
}

export interface SamplerDescriptor {
  readonly group: number;
  readonly binding: number;
  readonly name: SamplerName;
}

export type BindGroupLayoutEntriesByGroup = Record<
  number,
  GPUBindGroupLayoutEntry[]
>;

interface Shader {
  attributeMap: AttributeMap;
  uniformDescriptors: UniformDescriptor[];
  textureDescriptors: TextureDescriptor[];
  samplerDescriptors: SamplerDescriptor[];
  vertexEntry: string;
  fragmentEntry: string;
  computeEntry: string;
  bindGroupLayoutEntriesByGroup: BindGroupLayoutEntriesByGroup;
}

export const createShaderCode = async (): Promise<string> => {
  const code = `
  struct VertexInput {
    @location(0) position: vec4f,
    @location(1) uv: vec2f,
    @location(2) color: vec4f
  }

  struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) color: vec4f
  }

  struct Camera {
    uView: mat4x4f,
    uProjection: mat4x4f,
  }

  @group(0) @binding(0) var<uniform> uTime: f32;
  @group(0) @binding(1) var<uniform> uCamera: Camera;
  @group(1) @binding(0) var sColor: sampler;
  @group(1) @binding(1) var tColor: texture_2d<f32>;
  @group(2) @binding(0) var<uniform> uModel: mat4x4f;

  @vertex
  fn vertex_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = uCamera.uProjection * uCamera.uView * uModel * input.position;
    output.uv = input.uv;
    output.color = input.color;
    return output;
  }
  
  @fragment
  fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
    return textureSample(tColor, sColor, input.uv);
    // return vec4f(1.0, 0.0, 0.0, 1.0);
    // return input.color;
    // return vec4f(input.uv, 0.0, 0.0);
  }
  `;
  return Promise.resolve(code);
};

const getAttributeMap = (reflect: WgslReflect): AttributeMap => {
  const [{ inputs }] = reflect.entry.vertex;
  const attributeMap: Record<string, VertexAttribute> = {};
  for (const i of inputs) {
    attributeMap[i.name] = { name: i.name, shaderLocation: Number(i.location) };
  }
  return attributeMap;
};

const getUniformDescriptors = (reflect: WgslReflect): UniformDescriptor[] => {
  const uniformDescriptors: UniformDescriptor[] = [];
  const usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
  for (const u of reflect.uniforms) {
    const writerDescriptors: UniformWriterDescriptor[] = [];
    if (u.members) {
      for (const m of u.members) {
        writerDescriptors.push({
          name: m.name as UniformName,
          offset: m.offset,
        });
      }
    } else {
      writerDescriptors.push({ name: u.name as UniformName, offset: 0 });
    }
    uniformDescriptors.push({
      name: u.name as UniformName,
      group: u.group,
      binding: u.binding,
      bufferDescriptor: { size: u.size, usage },
      writerDescriptors,
    });
  }
  return uniformDescriptors;
};

const getTextureDescriptors = (reflect: WgslReflect): TextureDescriptor[] => {
  const textureDescriptors: TextureDescriptor[] = [];
  for (const t of reflect.textures) {
    textureDescriptors.push({
      group: t.group,
      binding: t.binding,
      name: t.name as TextureName,
    });
  }
  return textureDescriptors;
};

const getSamplerDescriptors = (reflect: WgslReflect): SamplerDescriptor[] => {
  const samplerDescriptors: SamplerDescriptor[] = [];
  for (const s of reflect.samplers) {
    samplerDescriptors.push({
      group: s.group,
      binding: s.binding,
      name: s.name as SamplerName,
    });
  }
  return samplerDescriptors;
};

const createVisibilityGetter = (
  reflect: WgslReflect,
): ((name: string) => number) => {
  const vertexResources =
    reflect.functions.find((f) => f.stage === "vertex")?.resources ?? [];
  const fragmentResources =
    reflect.functions.find((f) => f.stage === "fragment")?.resources ?? [];

  const vertexResourceNameMap = vertexResources.reduce<
    Partial<Record<string, number>>
  >((acc, r) => {
    acc[r.name] = GPUShaderStage.VERTEX;
    return acc;
  }, {});
  const fragmentResourceNameMap = fragmentResources.reduce<
    Partial<Record<string, number>>
  >((acc, r) => {
    acc[r.name] = GPUShaderStage.FRAGMENT;
    return acc;
  }, {});

  return (name: string): number =>
    (vertexResourceNameMap[name] ?? N0) | (fragmentResourceNameMap[name] ?? N0);
};

const createBindGroupLayoutEntriesByGroup = (
  reflect: WgslReflect,
): BindGroupLayoutEntriesByGroup => {
  const getVisibility = createVisibilityGetter(reflect);
  const bindGroupLayoutEntriesByGroup: BindGroupLayoutEntriesByGroup = {};

  for (const u of reflect.uniforms) {
    const bindgroupLayoutEntries = bindGroupLayoutEntriesByGroup[u.group] ?? [];
    if (!bindgroupLayoutEntries.length) {
      bindGroupLayoutEntriesByGroup[u.group] = bindgroupLayoutEntries;
    }
    bindgroupLayoutEntries.push({
      binding: u.binding,
      visibility: getVisibility(u.name),
      buffer: {
        type: "uniform",
        hasDynamicOffset: false,
        minBindingSize: u.size,
      },
    });
  }

  for (const t of reflect.textures) {
    const bindgroupLayoutEntries = bindGroupLayoutEntriesByGroup[t.group] ?? [];
    if (!bindgroupLayoutEntries.length) {
      bindGroupLayoutEntriesByGroup[t.group] = bindgroupLayoutEntries;
    }
    bindgroupLayoutEntries.push({
      binding: t.binding,
      visibility: getVisibility(t.name),
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: false,
      },
    });
  }

  for (const s of reflect.samplers) {
    const bindgroupLayoutEntries = bindGroupLayoutEntriesByGroup[s.group] ?? [];
    if (!bindgroupLayoutEntries.length) {
      bindGroupLayoutEntriesByGroup[s.group] = bindgroupLayoutEntries;
    }
    bindgroupLayoutEntries.push({
      binding: s.binding,
      visibility: getVisibility(s.name),
      sampler: {
        type: "filtering",
      },
    });
  }

  for (const key in bindGroupLayoutEntriesByGroup) {
    bindGroupLayoutEntriesByGroup[key] = bindGroupLayoutEntriesByGroup[
      key
    ].sort((a, b) => a.binding - b.binding);
  }

  return bindGroupLayoutEntriesByGroup;
};

export const parseShaderCode = (code: string): Shader => {
  const reflect = new WgslReflect(code);
  return {
    attributeMap: getAttributeMap(reflect),
    uniformDescriptors: getUniformDescriptors(reflect),
    textureDescriptors: getTextureDescriptors(reflect),
    samplerDescriptors: getSamplerDescriptors(reflect),
    vertexEntry: reflect.entry.vertex[N0]?.name ?? "",
    fragmentEntry: reflect.entry.fragment[N0]?.name ?? "",
    computeEntry: reflect.entry.compute[N0]?.name ?? "",
    bindGroupLayoutEntriesByGroup: createBindGroupLayoutEntriesByGroup(reflect),
  };
};
