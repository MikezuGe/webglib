/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CustomCanvas, initWebGPU } from "@webglib/custom-canvas";
import { Cube } from "@webglib/geometry";
import { mat4 } from "wgpu-matrix";
import shaderCode from "bundle-text:./shaderCode.wgsl";
import { Shader } from "./Shader";

export const test = async (): Promise<void> => {
  const cube = new Cube();
  cube.useAttributes({
    position: 0,
    color: 1,
    normal: 2,
  });
  const cubeVerticeData = cube.generateVertices();

  const customCanvas = new CustomCanvas();
  const { device, context } = await initWebGPU(customCanvas);

  const vertexBuffer = device.createBuffer({
    size: cubeVerticeData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, cubeVerticeData);

  const viewProjectionBuffer = device.createBuffer({
    size: 64, // 16 * 2 * 4
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const projectionMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const viewProjectionMatrix = new Float32Array(16);
  mat4.lookAt([2, 2, 5], [0, 0, 0], [0, 1, 0], viewMatrix);
  const fovy = 45 * (Math.PI / 180);
  const aspect = customCanvas.width / customCanvas.height;
  mat4.perspective(fovy, aspect, 0.1, 100, projectionMatrix);
  mat4.multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

  device.queue.writeBuffer(viewProjectionBuffer, 0, viewProjectionMatrix);

  const modelMatrix = new Float32Array(16);
  mat4.identity(modelMatrix);
  const modelBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const shader = await Shader.create(device, cube.attributes, shaderCode);
  const renderPipeline = shader.createRenderPipeline(cube);

  const bindGroup = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: viewProjectionBuffer },
      },
      {
        binding: 1,
        resource: { buffer: modelBuffer },
      },
    ],
  });

  let r = 0;
  const render = (): void => {
    if (r++ > 60) {
      return;
    }
    console.log(r);

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
          view: context.getCurrentTexture().createView(),
        },
      ],
    };

    mat4.rotationX(performance.now() * 0.001, modelMatrix);
    mat4.rotateY(modelMatrix, performance.now() * 0.003, modelMatrix);
    device.queue.writeBuffer(modelBuffer, 0, modelMatrix);

    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
    renderPass.setPipeline(renderPipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.draw(cube.verticesCount);
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test();
