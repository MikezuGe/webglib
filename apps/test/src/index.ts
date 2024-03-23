/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CustomCanvas, initWebGPU } from "@webglib/custom-canvas";
import { Cube } from "@webglib/geometry";
import { mat4 } from "wgpu-matrix";

const shaderCode = `
struct Uniforms {
  viewProjectionMatrix: mat4x4<f32>
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexIn {
  @location(0) position: vec4f,
  @location(1) color: vec3f
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f
}

@vertex
fn vertex_main(vertexIn: VertexIn) -> VertexOutput {
  var output: VertexOutput;
  output.position = uniforms.viewProjectionMatrix * vertexIn.position;
  output.color = vertexIn.color;
  return output;
}

@fragment
fn fragment_main(fragmentData: VertexOutput) -> @location(0) vec4f
{
  return vec4f(fragmentData.color, 0.0);
}
` as const;

export const test = async (): Promise<void> => {
  const cube = new Cube();
  cube.useAttributes({
    position: 0,
    color: 1,
  });
  const customCanvas = new CustomCanvas();
  const gpu = await initWebGPU(customCanvas);
  const { device, format, context } = gpu;

  const vertexBuffer = device.createBuffer({
    size: cube.verticesByteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  const cubeVerticeData = new Float32Array(vertexBuffer.getMappedRange());
  cube.generateVertices(cubeVerticeData);
  vertexBuffer.unmap();

  const uniformBuffer = device.createBuffer({
    size: 64, // 16 * 4
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

  device.queue.writeBuffer(uniformBuffer, 0, viewProjectionMatrix);

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

  const shaderModule = device.createShaderModule({
    code: shaderCode,
  });

  const renderPipeline = device.createRenderPipeline({
    vertex: {
      module: shaderModule,
      entryPoint: "vertex_main",
      buffers: [
        {
          stepMode: "vertex",
          arrayStride: cube.strideBytes,
          attributes: cube.attributes,
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragment_main",
      targets: [{ format }],
    },
    primitive: {
      topology: "triangle-list",
      cullMode: "back",
      frontFace: "ccw",
    },
    layout: "auto",
  });

  const bindGroup = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  const commandEncoder = device.createCommandEncoder();
  const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
  renderPass.setPipeline(renderPipeline);
  renderPass.setBindGroup(0, bindGroup);
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.draw(36);
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test();
