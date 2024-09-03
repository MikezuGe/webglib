import type { Camera } from "../Camera";
import { initWebGPU } from "../CustomCanvas";
import type { CustomCanvas } from "../CustomCanvas";
import type { Geometry } from "../Geometry";
import type { Material } from "../Material";
import type { Mesh } from "../Mesh";
import type { Scene } from "../Scene";
import type { Shader } from "../Shader";
import { MAT4_SIZE, N0, N1, VEC3_SIZE } from "../definitions";
import type {
  BindingGroup,
  IInitWebGPU,
  Renderable,
  UniformWriter,
  UniformWriters,
} from "../types";

import { renderPassDescriptor } from "./renderPassDescriptor";

const floatx1 = new Float32Array(N1);
const floatx3 = new Float32Array(VEC3_SIZE);
const floatx16 = new Float32Array(MAT4_SIZE);

export class Renderer {
  public readonly canvas: CustomCanvas;
  // @ts-expect-error - Might be necessary at some point
  private readonly _adapter: GPUAdapter;
  private readonly _context: GPUCanvasContext;
  private readonly _device: GPUDevice;
  private readonly _textureFormat: GPUTextureFormat;
  private readonly _renderables = new Map<Mesh, Renderable>();
  private readonly _renderPipelines = new Map<Mesh, GPURenderPipeline>();
  private readonly _geometryBuffers = new Map<
    Geometry,
    { vertexBuffers: GPUBuffer[]; indexBuffer?: GPUBuffer }
  >();

  public constructor({
    adapter,
    canvas,
    context,
    device,
    textureFormat,
  }: IInitWebGPU) {
    this._adapter = adapter;
    this.canvas = canvas;
    this._context = context;
    this._device = device;
    this._textureFormat = textureFormat;
  }

  public static async create(): Promise<Renderer> {
    const gpu = await initWebGPU();
    return new Renderer(gpu);
  }

  public renderScene(scene: Scene, camera: Camera): void {
    const renderables = new Map<Mesh, Renderable>();
    const { gameObjects } = scene;
    for (const gameObject of gameObjects) {
      const { model, transform } = gameObject;
      if (!model) {
        continue;
      }
      for (const mesh of model.meshes) {
        const renderable = renderables.get(mesh);
        if (renderable) {
          const { binding, writer } = this._setupModelUniform(
            renderable.renderPipeline,
            mesh.shader,
          );
          renderable.transforms.push({
            transform,
            bindingGroup: binding,
            uniformWriter: writer,
          });
          continue;
        }
        const _renderable = this._renderables.get(mesh);
        if (_renderable) {
          const { binding, writer } = this._setupModelUniform(
            _renderable.renderPipeline,
            mesh.shader,
          );
          _renderable.transforms = [
            {
              transform,
              bindingGroup: binding,
              uniformWriter: writer,
            },
          ];
          renderables.set(mesh, _renderable);
          continue;
        }
        if (!mesh.renderReady) {
          continue;
        }
        const { indexFormat, drawCount } = mesh.geometry;
        const { vertexBuffers, indexBuffer } = this._setupBuffers(
          mesh.geometry,
        );
        const renderPipeline = this._setupRenderPipeline(mesh);
        const { binding, writer } = this._setupModelUniform(
          renderPipeline,
          mesh.shader,
        );
        const { uniformBindings, uniformWriters } = this._setupUniforms(
          renderPipeline,
          mesh.shader,
        );
        const textureBindings = this._setupTextures(
          renderPipeline,
          mesh.material,
          mesh.shader,
        );

        const newRenderable: Renderable = {
          vertexBuffers,
          indexBuffer,
          indexFormat,
          drawCount,
          renderPipeline,
          bindingGroups: [...uniformBindings, ...textureBindings],
          uniformWriters,
          transforms: [
            {
              transform,
              bindingGroup: binding,
              uniformWriter: writer,
            },
          ],
        };
        renderables.set(mesh, newRenderable);
        this._renderables.set(mesh, newRenderable);
      }
    }
    this._render(renderables.values(), camera);
  }

  private _setupBuffers(geometry: Geometry): {
    vertexBuffers: GPUBuffer[];
    indexBuffer?: GPUBuffer;
  } {
    if (this._geometryBuffers.has(geometry)) {
      return this._geometryBuffers.get(geometry)!;
    }
    const { _device } = this;
    const { vertices, vertexBuffersBytes, indices, indiceBytes, indexFormat } =
      geometry;
    const buffers: { vertexBuffers: GPUBuffer[]; indexBuffer?: GPUBuffer } = {
      vertexBuffers: [],
    };
    this._geometryBuffers.set(geometry, buffers);

    let i = 0;
    for (const vert of vertices) {
      const vertexBuffer = _device.createBuffer({
        size: vertexBuffersBytes[i++],
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
      });
      new Float32Array(vertexBuffer.getMappedRange()).set(vert);
      vertexBuffer.unmap();
      buffers.vertexBuffers.push(vertexBuffer);
    }

    if (!indices) {
      return buffers;
    }

    buffers.indexBuffer = _device.createBuffer({
      size: indiceBytes,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    if (indexFormat === "uint16") {
      new Uint16Array(buffers.indexBuffer.getMappedRange()).set(indices);
    } else {
      new Uint32Array(buffers.indexBuffer.getMappedRange()).set(indices);
    }
    buffers.indexBuffer.unmap();

    return buffers;
  }

  private _setupRenderPipeline(mesh: Mesh): GPURenderPipeline {
    const { _device, _textureFormat } = this;
    const _renderPipeline = this._renderPipelines.get(mesh);
    if (_renderPipeline) {
      return _renderPipeline;
    }

    const { geometry } = mesh;
    const shaderModule = _device.createShaderModule({
      code: mesh.shader.code!,
    });
    const newRenderPipeline = _device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule,
        buffers: geometry.vertexBufferLayout,
        entryPoint: "vertex_main",
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [{ format: _textureFormat }],
      },
      primitive: geometry.primitive,
    });

    this._renderPipelines.set(mesh, newRenderPipeline);
    return newRenderPipeline;
  }

  private _setupModelUniform(
    renderPipeline: GPURenderPipeline,
    shader: Shader,
  ): { binding: BindingGroup; writer: UniformWriter } {
    const { _device } = this;
    const { group, binding, bufferDescriptor, writerDescriptors } =
      shader.getUniformDescriptor("uModel");
    const [{ offset }] = writerDescriptors;
    const buffer = _device.createBuffer(bufferDescriptor);
    return {
      binding: {
        bindGroupIndex: group,
        bindGroup: _device.createBindGroup({
          layout: renderPipeline.getBindGroupLayout(group),
          entries: [{ binding, resource: { buffer } }],
        }),
      },
      writer: { buffer, offset },
    };
  }

  private _setupUniforms(
    renderPipeline: GPURenderPipeline,
    shader: Shader,
  ): { uniformBindings: BindingGroup[]; uniformWriters: UniformWriters } {
    const { _device } = this;
    const entriesByGroup = new Map<number, GPUBindGroupEntry[]>();
    const uniformWriters = {} as UniformWriters;
    for (const {
      group,
      binding,
      bufferDescriptor,
      writerDescriptors,
    } of shader.uniformDescriptors) {
      // Think of a better way to not setup uModel here.
      // There's a dedicated method for that, _setupModelUniform.
      if (writerDescriptors.find((n) => n.name === "uModel")) {
        continue;
      }
      let entries = entriesByGroup.get(group);
      if (!entries) {
        entries = [];
        entriesByGroup.set(group, entries);
      }
      const buffer = _device.createBuffer(bufferDescriptor);
      for (const { name, offset } of writerDescriptors) {
        uniformWriters[name] = { buffer, offset };
      }
      entries.push({ binding, resource: { buffer } });
    }

    const uniformBindings: BindingGroup[] = [];
    for (const [bindGroupIndex, entries] of entriesByGroup) {
      const bindGroup = _device.createBindGroup({
        layout: renderPipeline.getBindGroupLayout(bindGroupIndex),
        entries,
      });
      uniformBindings.push({
        bindGroupIndex,
        bindGroup,
      });
    }
    return {
      uniformBindings,
      uniformWriters,
    };
  }

  private _setupTextures(
    renderPipeline: GPURenderPipeline,
    material: Material,
    shader: Shader,
  ): BindingGroup[] {
    const { _device } = this;
    const entriesByGroup = new Map<number, GPUBindGroupEntry[]>();
    const usage =
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT;
    for (const { format, size, source, type } of material.textures) {
      const { group, binding, samplerName } = shader.getTextureDescriptor(type);
      let entries = entriesByGroup.get(group);
      if (!entries) {
        entries = [];
        entriesByGroup.set(group, entries);
      }
      const sampler = _device.createSampler();
      const texture = _device.createTexture({
        size,
        format,
        usage,
      });
      _device.queue.copyExternalImageToTexture(
        { source },
        { texture, premultipliedAlpha: true },
        size,
      );
      const { binding: samplerBinding } = shader.getSamplerBinding(samplerName);
      entries.push({ binding: samplerBinding, resource: sampler });
      entries.push({ binding, resource: texture.createView() });
    }

    const textureBindings: BindingGroup[] = [];
    for (const [bindGroupIndex, entries] of entriesByGroup) {
      const bindGroup = _device.createBindGroup({
        layout: renderPipeline.getBindGroupLayout(bindGroupIndex),
        entries,
      });
      textureBindings.push({
        bindGroupIndex,
        bindGroup,
      });
    }

    return textureBindings;
  }

  private _render(
    renderables: IterableIterator<Renderable>,
    camera: Camera,
  ): void {
    const { _device } = this;

    floatx1[N0] = performance.now();
    floatx3.set([N1, N0, N0]);

    const commandEncoder = _device.createCommandEncoder();
    renderPassDescriptor.colorAttachments[N0].view = this._context
      .getCurrentTexture()
      .createView();
    const renderPassEncoder =
      commandEncoder.beginRenderPass(renderPassDescriptor);

    for (const renderable of renderables) {
      const {
        vertexBuffers,
        indexBuffer,
        indexFormat,
        drawCount,
        renderPipeline,
        bindingGroups,
        uniformWriters,
        transforms,
      } = renderable;

      renderPassEncoder.setPipeline(renderPipeline);

      for (const g of bindingGroups) {
        renderPassEncoder.setBindGroup(g.bindGroupIndex, g.bindGroup);
      }

      const { uTime, uDefaultColor, uView, uViewProjection } = uniformWriters;
      if (uTime) {
        const u = uTime;
        _device.queue.writeBuffer(u.buffer, u.offset, floatx1);
      }
      if (uDefaultColor) {
        const u = uDefaultColor;
        _device.queue.writeBuffer(u.buffer, u.offset, floatx3);
      }
      if (uView) {
        const u = uView;
        camera.copyView(floatx16);
        _device.queue.writeBuffer(u.buffer, u.offset, floatx16);
      }
      if (uViewProjection) {
        const u = uViewProjection;
        camera.copyViewProjection(floatx16);
        _device.queue.writeBuffer(u.buffer, u.offset, floatx16);
      }

      for (const {
        transform,
        uniformWriter: u,
        bindingGroup: g,
      } of transforms) {
        transform.copyWorldTransform(floatx16);
        renderPassEncoder.setBindGroup(g.bindGroupIndex, g.bindGroup);
        _device.queue.writeBuffer(u.buffer, u.offset, floatx16);

        let i = 0;
        for (const vertexBuffer of vertexBuffers) {
          renderPassEncoder.setVertexBuffer(i++, vertexBuffer);
        }
        if (indexBuffer) {
          renderPassEncoder.setIndexBuffer(indexBuffer, indexFormat);
          renderPassEncoder.drawIndexed(drawCount);
        } else {
          renderPassEncoder.draw(drawCount);
        }
      }
    }

    renderPassEncoder.end();
    _device.queue.submit([commandEncoder.finish()]);
  }
}
