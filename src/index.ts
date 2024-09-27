/* eslint-disable @typescript-eslint/no-magic-numbers */
import { mat4 } from "wgpu-matrix";

import { PerspectiveCamera } from "./Camera";
import { type CustomCanvas, initWebGPU } from "./CustomCanvas";
import { Transform } from "./Transform";
import { MAT4_SIZE, N1 } from "./definitions";
import { createPlaneData, createVertexBuffers } from "./geometry";
import { render } from "./renderer";
import { createLayouts, defaultCode, parseShaderCode } from "./shader";
import {
  createSampler,
  createTexture,
  createTextureBindGroup,
} from "./texture";
import type {
  AttributeName,
  Renderable,
  SamplerName,
  TextureName,
  UniformMemberNameMap,
  UniformName,
} from "./types";
import {
  createUniformBindGroup,
  createUniformBuffer,
  createUniformWriter,
} from "./uniform";
import { loadAsset } from "./utils";

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

  const {
    attributeMap,
    fragmentEntry,
    vertexEntry,
    uniformDescriptors,
    textureDescriptors,
    samplerDescriptors,
    bindGroupLayoutEntriesByGroup,
  } = parseShaderCode<
    AttributeName,
    UniformName,
    TextureName,
    SamplerName,
    UniformMemberNameMap
  >(defaultCode);

  const { bindGroupLayoutsByGroup, pipelineLayout } = createLayouts(
    device,
    bindGroupLayoutEntriesByGroup,
  );

  const imageBitmap = await loadAsset("texture", "eat", "png");
  const textureSize: GPUExtent3DStrict = {
    width: imageBitmap.width,
    height: imageBitmap.height,
    depthOrArrayLayers: 1,
  };

  const uTime = createUniformBuffer(device, uniformDescriptors, "uTime");
  const uCamera = createUniformBuffer(device, uniformDescriptors, "uCamera");
  const tColor = createTexture(device, { imageBitmap, size: textureSize });
  const sColor = createSampler(device, {});

  const uTimeWriters = createUniformWriter({
    device,
    uniformDescriptors,
    uniformBuffer: uTime,
    name: "uTime",
  });

  const uCameraWriters = createUniformWriter({
    device,
    uniformDescriptors,
    uniformBuffer: uCamera,
    name: "uCamera",
  });

  const timeCameraBindGroup = createUniformBindGroup({
    device,
    uniformDescriptors,
    bindGroupLayoutsByGroup,
    uniformBuffersByName: {
      uTime,
      uCamera,
    },
  });

  const textureBindGroup = createTextureBindGroup({
    device,
    samplerDescriptors,
    textureDescriptors,
    bindGroupLayoutsByGroup,
    texturesByName: { tColor },
    samplersByName: { sColor },
  });

  const vertexData = await createPlaneData();
  const {
    drawCount,
    indexBuffer,
    indexFormat,
    primitive,
    vertexBufferLayout,
    vertexBuffers,
  } = createVertexBuffers(device, attributeMap, vertexData);

  const shaderModule = device.createShaderModule({ code: defaultCode });
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

  const uModel1 = createUniformBuffer(device, uniformDescriptors, "uModel");

  const uModel1Writers = createUniformWriter({
    device,
    uniformDescriptors,
    uniformBuffer: uModel1,
    name: "uModel",
  });

  const uModel1BindGroup = createUniformBindGroup({
    device,
    uniformDescriptors,
    bindGroupLayoutsByGroup,
    uniformBuffersByName: { uModel: uModel1 },
  });

  const uModel2 = createUniformBuffer(device, uniformDescriptors, "uModel");

  const uModel2Writers = createUniformWriter({
    device,
    uniformDescriptors,
    uniformBuffer: uModel2,
    name: "uModel",
  });

  const uModel2BindGroup = createUniformBindGroup({
    device,
    uniformDescriptors,
    bindGroupLayoutsByGroup,
    uniformBuffersByName: { uModel: uModel2 },
  });

  const transform1 = new Transform();
  const transform2 = new Transform();

  const camera = new PerspectiveCamera();
  camera.transform.pz = 5;

  const f1 = new Float32Array(N1);
  const f16 = new Float32Array(MAT4_SIZE);
  mat4.identity(f16);

  f1.set([0.0]);
  uTimeWriters.uTime(f1);

  camera.copyView(f16);
  uCameraWriters.uView(f16);

  camera.copyProjection(f16);
  uCameraWriters.uProjection(f16);

  transform1.px = -1.0;
  transform1.copyWorldTransform(f16);
  uModel1Writers.uModel(f16);

  transform2.px = 1.0;
  transform2.copyWorldTransform(f16);
  uModel2Writers.uModel(f16);

  const renderables = new Map<GPUBuffer[], Renderable>();
  renderables.set(vertexBuffers, {
    renderPipeline,
    vertexBuffers,
    indexBuffer,
    indexFormat,
    drawCount,
    modelBindGroupIndex: uModel1BindGroup.bindGroupIndex,
    textureBindGroupIndex: textureBindGroup.bindGroupIndex,
    textureBindGroups: [
      {
        textureBindGroup: textureBindGroup.bindGroup,
        modelBindGroups: [
          uModel1BindGroup.bindGroup,
          uModel2BindGroup.bindGroup,
        ],
      },
    ],
  });

  const [colorAttachment] = renderPassDescriptor.colorAttachments;
  colorAttachment.view = context.getCurrentTexture().createView();
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

  passEncoder.setBindGroup(
    timeCameraBindGroup.bindGroupIndex,
    timeCameraBindGroup.bindGroup,
  );

  render(passEncoder, renderables.values());

  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
};

void run();
