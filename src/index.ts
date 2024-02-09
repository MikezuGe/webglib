/* eslint-disable @typescript-eslint/no-magic-numbers */
import { mat4, setDefaultType } from "wgpu-matrix";
import { initWebGPU } from "./CustomCanvas";
import { FLOAT_BYTES, MAT4_BYTES, MAT4_SIZE } from "./definitions";
import shaderCode from "bundle-text:./assets/shaderCode.wgsl";
import { Cube, Plane } from "./Geometry";
import { Mesh } from "./Mesh";
import { PerspectiveCamera } from "./Camera";
import { Shader } from "./Shader";

setDefaultType(Array);

export const run = async (): Promise<void> => {
  const { device, context, canvas, textureFormat } = await initWebGPU();

  const cubeMesh = new Mesh(new Cube());
  cubeMesh.geometry.indiced = true;
  cubeMesh.setupBuffers(device);

  const planeMesh = new Mesh(new Plane());
  planeMesh.geometry.indiced = true;
  planeMesh.geometry.divisions = 2;
  planeMesh.setupBuffers(device);

  const camera = new PerspectiveCamera();
  camera.aspectRatio = canvas.aspectRatio;
  camera.transform.px = 2;
  camera.transform.py = 2;
  camera.transform.pz = 10;

  // prettier-ignore
  const shader = new Shader({
    code: shaderCode,
    geometry: cubeMesh.geometry,
    textureFormat,
    device
  });

  const timeUniformBuffer = device.createBuffer({
    size: FLOAT_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const cameraUniformBuffer = device.createBuffer({
    size: MAT4_BYTES * 2,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const colorUniformBuffer = device.createBuffer({
    size: FLOAT_BYTES * 3,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const cubeUniformBuffer = device.createBuffer({
    size: MAT4_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const planeUniformBuffer = device.createBuffer({
    size: MAT4_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const cameraColorBindGroup = device.createBindGroup({
    layout: shader.renderPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: timeUniformBuffer },
      },
      {
        binding: 1,
        resource: { buffer: cameraUniformBuffer },
      },
      {
        binding: 2,
        resource: { buffer: colorUniformBuffer },
      },
    ],
  });

  const cubeBindGroup = device.createBindGroup({
    layout: shader.renderPipeline.getBindGroupLayout(1),
    entries: [
      {
        binding: 0,
        resource: { buffer: cubeUniformBuffer },
      },
    ],
  });

  const planeBindGroup = device.createBindGroup({
    layout: shader.renderPipeline.getBindGroupLayout(1),
    entries: [
      {
        binding: 0,
        resource: { buffer: planeUniformBuffer },
      },
    ],
  });

  const commandEncoder = device.createCommandEncoder();
  const clearColor = { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };
  const gpuRenderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        clearValue: clearColor,
        loadOp: "clear",
        storeOp: "store",
        view: context.getCurrentTexture().createView(),
      },
    ],
  };
  const renderPass = commandEncoder.beginRenderPass(gpuRenderPassDescriptor);
  renderPass.setPipeline(shader.renderPipeline);

  const view = camera.copyView();
  const viewProjection = camera.copyViewProjection();
  renderPass.setBindGroup(0, cameraColorBindGroup);
  const now = new Float32Array([performance.now()]);
  device.queue.writeBuffer(timeUniformBuffer, 0, now, 0, 1);
  device.queue.writeBuffer(cameraUniformBuffer, 0, view);
  device.queue.writeBuffer(cameraUniformBuffer, MAT4_BYTES, viewProjection);
  const color = new Float32Array([0, 1, 0]);
  device.queue.writeBuffer(colorUniformBuffer, 0, color);

  const model = new Float32Array(MAT4_SIZE);
  mat4.identity(model);
  model[12] = -3;
  device.queue.writeBuffer(cubeUniformBuffer, 0, model);
  model[12] = 3;
  device.queue.writeBuffer(planeUniformBuffer, 0, model);

  // Cube render
  renderPass.setVertexBuffer(0, cubeMesh.vertexBuffer);
  renderPass.setBindGroup(1, cubeBindGroup);
  renderPass.setIndexBuffer(cubeMesh.indexBuffer, cubeMesh.indexFormat);
  renderPass.drawIndexed(cubeMesh.geometry.drawCount);

  // Plane render
  renderPass.setVertexBuffer(0, planeMesh.vertexBuffer);
  renderPass.setBindGroup(1, planeBindGroup);
  renderPass.setIndexBuffer(planeMesh.indexBuffer, planeMesh.indexFormat);
  renderPass.drawIndexed(planeMesh.geometry.drawCount);

  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
};

void run();
