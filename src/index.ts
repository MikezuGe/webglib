/* eslint-disable @typescript-eslint/no-magic-numbers */
import { mat4 } from "wgpu-matrix";

import { PerspectiveCamera } from "./Camera";
import type { CustomCanvas } from "./CustomCanvas";
import { initWebGPU } from "./CustomCanvas";
import {
  createSampler,
  createTexture,
  createTextureBindGroup,
  loadTexture,
} from "./Texture";
import { createUniformBindGroup, createUniformBuffer } from "./Uniform";
import { MAT4_BYTES, MAT4_SIZE } from "./definitions";
import {
  createPlaneData,
  createBuffers as createVertexBuffers,
} from "./geometry";
import { createShaderCode, parseShaderCode } from "./shader";

interface Renderable {
  renderPipeline: GPURenderPipeline;
  vertexBuffers: GPUBuffer[];
  indexBuffer?: GPUBuffer;
  indexFormat?: GPUIndexFormat;
  drawCount: number;
  textureBindGroupIndex: number;
  textureBindGroup: GPUBindGroup;
  modelBindGroupIndex: number;
  modelBindGroups: GPUBindGroup[];
}

const setupCanvas = (canvas: CustomCanvas): void => {
  document.body.appendChild(canvas.canvas);
  const resizeCanvas = (): void => {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  window.onresize = resizeCanvas;
  resizeCanvas();
};

const createLayouts = (
  device: GPUDevice,
  bindGroupLayoutEntriesByGroup: Record<number, GPUBindGroupLayoutEntry[]>,
): {
  bindGroupLayoutsByGroup: Record<number, GPUBindGroupLayout>;
  pipelineLayout: GPUPipelineLayout;
} => {
  const bindGroupLayoutsByGroup: Record<number, GPUBindGroupLayout> = {};
  for (const group in bindGroupLayoutEntriesByGroup) {
    bindGroupLayoutsByGroup[group] = device.createBindGroupLayout({
      entries: bindGroupLayoutEntriesByGroup[group],
    });
  }
  const bindGroupLayouts: GPUBindGroupLayout[] = [];
  const sortedGroups = Object.keys(bindGroupLayoutsByGroup)
    .map((k) => Number(k))
    .sort((a, b) => a - b);
  for (const group of sortedGroups) {
    bindGroupLayouts.push(bindGroupLayoutsByGroup[group]);
  }
  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts,
  });
  return {
    bindGroupLayoutsByGroup,
    pipelineLayout,
  };
};

const renderIndexed = (
  passEncoder: GPURenderPassEncoder,
  renderable: Renderable,
): void => {
  const {
    modelBindGroups,
    modelBindGroupIndex,
    drawCount,
    indexBuffer,
    indexFormat,
  } = renderable;
  passEncoder.setIndexBuffer(indexBuffer!, indexFormat!);
  for (const bindGroup of modelBindGroups) {
    passEncoder.setBindGroup(modelBindGroupIndex, bindGroup);
    passEncoder.drawIndexed(drawCount);
  }
};

const renderNormally = (
  passEncoder: GPURenderPassEncoder,
  renderable: Renderable,
): void => {
  const { modelBindGroups, modelBindGroupIndex, drawCount } = renderable;
  for (const bindGroup of modelBindGroups) {
    passEncoder.setBindGroup(modelBindGroupIndex, bindGroup);
    passEncoder.draw(drawCount);
  }
};

const render = (
  passEncoder: GPURenderPassEncoder,
  renderables: Renderable[],
): void => {
  for (const renderable of renderables) {
    passEncoder.setPipeline(renderable.renderPipeline);
    passEncoder.setBindGroup(
      renderable.textureBindGroupIndex,
      renderable.textureBindGroup,
    );
    let i = 0;
    for (const buffer of renderable.vertexBuffers) {
      passEncoder.setVertexBuffer(i++, buffer);
    }
    if (renderable.indexBuffer) {
      renderIndexed(passEncoder, renderable);
    } else {
      renderNormally(passEncoder, renderable);
    }
  }
};

const renderPassDescriptor = {
  colorAttachments: [
    {
      clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      loadOp: "clear",
      storeOp: "store",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      view: undefined as unknown as any,
    },
  ],
} satisfies GPURenderPassDescriptor;

export const run = async (): Promise<void> => {
  const { canvas, context, device, textureFormat } = await initWebGPU();
  setupCanvas(canvas);

  const code = await createShaderCode();
  const {
    attributeMap,
    fragmentEntry,
    vertexEntry,
    uniformDescriptors,
    textureDescriptors,
    samplerDescriptors,
    bindGroupLayoutEntriesByGroup,
  } = parseShaderCode(code);

  const { bindGroupLayoutsByGroup, pipelineLayout } = createLayouts(
    device,
    bindGroupLayoutEntriesByGroup,
  );

  const vertexData = await createPlaneData();
  const {
    drawCount,
    indexBuffer,
    indexFormat,
    primitive,
    vertexBufferLayout,
    vertexBuffers,
  } = createVertexBuffers(device, attributeMap, vertexData);

  const imageBitmap = await loadTexture("eat.png");
  const textureSize: GPUExtent3DStrict = {
    width: imageBitmap.width,
    height: imageBitmap.height,
    depthOrArrayLayers: 1,
  };

  const uTime = createUniformBuffer(device, uniformDescriptors, "uTime");
  const uCamera = createUniformBuffer(device, uniformDescriptors, "uCamera");
  const tColor = createTexture(device, { imageBitmap, size: textureSize });
  const sColor = createSampler(device, {});
  const uModel = createUniformBuffer(device, uniformDescriptors, "uModel");

  const timeCameraBindGroup = createUniformBindGroup(
    device,
    uniformDescriptors,
    bindGroupLayoutsByGroup,
    {
      uTime,
      uCamera,
    },
  );

  const textureBindGroup = createTextureBindGroup({
    device,
    samplerDescriptors,
    textureDescriptors,
    bindGroupLayoutsByGroup,
    texturesByName: { tColor },
    samplersByName: { sColor },
  });

  const modelBindGroup = createUniformBindGroup(
    device,
    uniformDescriptors,
    bindGroupLayoutsByGroup,
    {
      uModel,
    },
  );

  /*
  const textureSize: GPUExtent3DStrict = {
    width: 2,
    height: 2,
    depthOrArrayLayers: 1,
  };

  const r = [255, 0, 0, 255];
  const g = [0, 255, 0, 255];
  const b = [0, 0, 255, 255];
  const w = [255, 255, 255, 255];
  device.queue.writeTexture(
    { texture: tColor },
    // prettier-ignore
    new Uint8Array([
      ...r, ...g,
      ...b, ...w
    ]),
    { bytesPerRow: textureSize.width * 4 * UINT8_BYTES },
    textureSize,
  );
  */

  const shaderModule = device.createShaderModule({ code });
  const renderPipeline = await device.createRenderPipelineAsync({
    layout: pipelineLayout,
    vertex: {
      module: shaderModule,
      entryPoint: vertexEntry,
      buffers: vertexBufferLayout,
    },
    fragment: {
      module: shaderModule,
      entryPoint: fragmentEntry,
      targets: [{ format: textureFormat }],
    },
    primitive,
  });

  const m4data = mat4.identity();
  device.queue.writeBuffer(uModel, 0, m4data);
  const renderables: Renderable[] = [
    {
      renderPipeline,
      vertexBuffers,
      indexBuffer,
      indexFormat,
      drawCount,
      textureBindGroupIndex: textureBindGroup.bindGroupIndex,
      textureBindGroup: textureBindGroup.bindGroup,
      modelBindGroupIndex: modelBindGroup.bindGroupIndex,
      modelBindGroups: [modelBindGroup.bindGroup],
    },
  ];

  const [colorAttachment] = renderPassDescriptor.colorAttachments;
  colorAttachment.view = context.getCurrentTexture().createView();
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

  passEncoder.setBindGroup(
    timeCameraBindGroup.bindGroupIndex,
    timeCameraBindGroup.bindGroup,
  );
  device.queue.writeBuffer(uTime, 0, new Float32Array([0.0]));
  const camera = new PerspectiveCamera();
  camera.transform.pz = 5;
  // prettier-ignore
  device.queue.writeBuffer(uCamera, 0, camera.copyView(new Float32Array(MAT4_SIZE)));
  // prettier-ignore
  device.queue.writeBuffer(uCamera, MAT4_BYTES, camera.copyProjection(new Float32Array(MAT4_SIZE)));

  render(passEncoder, renderables);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
};

void run();
