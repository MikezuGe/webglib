/* eslint-disable @typescript-eslint/no-magic-numbers */
import shaderCode from "bundle-text:./assets/shaderCode.wgsl";
import { mat4, vec3 } from "wgpu-matrix";

import { OrthographicCamera, PerspectiveCamera } from "./Camera";
import type { Camera } from "./Camera";
import { initWebGPU } from "./CustomCanvas";
import { Cube, GeometryAttributes, Plane } from "./Geometry";
import { Mesh } from "./Mesh";
import { Shader } from "./Shader";
import type { UniformDefinitionMap } from "./Shader";
import { Transform } from "./Transform";
import { FLOAT32_BYTES, MAT4_BYTES, N1, N3 } from "./definitions";
import { Inputs } from "./utils";

const uniformDefinitions = {
  camera: {
    bindGroupIndex: 0,
    bufferDefinitions: {
      time: { binding: 0, size: FLOAT32_BYTES, offset: 0 },
      view: { binding: 1, size: MAT4_BYTES, offset: 0 },
      viewProjection: { binding: 1, size: MAT4_BYTES, offset: MAT4_BYTES },
      color: { binding: 2, size: FLOAT32_BYTES * N3, offset: 0 },
    },
  },
  model: {
    bindGroupIndex: 1,
    bufferDefinitions: {
      model: { binding: 0, offset: 0, size: MAT4_BYTES },
    },
  },
} satisfies UniformDefinitionMap;

export const run = async (): Promise<void> => {
  const inputs = new Inputs();
  const { device, context, canvas, textureFormat } = await initWebGPU();

  const cubeMesh = new Mesh(new Cube());
  cubeMesh.geometry.indiced = false;
  cubeMesh.geometry.enableAttributes([
    GeometryAttributes.position,
    GeometryAttributes.normal,
  ]);
  cubeMesh.setupBuffers(device);

  const planeMesh = new Mesh(new Plane());
  planeMesh.geometry.enableAttributes([
    GeometryAttributes.position,
    GeometryAttributes.normal,
  ]);
  planeMesh.setupBuffers(device);

  const perspectiveCamera = new PerspectiveCamera();
  perspectiveCamera.aspectRatio = canvas.aspectRatio;
  perspectiveCamera.transform.setPosition([0, 2, 10]);
  window.onresize = (): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    perspectiveCamera.aspectRatio = canvas.aspectRatio;
  };
  // prettier-ignore
  inputs.addInput({ mode: "Perspective", type: "range", name: "fov", min: 0, max: 100, step: 1, initialValue: -5, onInput: (value) => perspectiveCamera.fieldOfView = value });

  const orthographicCamera = new OrthographicCamera();
  orthographicCamera.set({
    left: -5,
    right: 5,
    top: -5,
    bottom: 5,
    near: 1,
    far: 100,
  });
  orthographicCamera.transform.setPosition([0, 0, 0]);
  // prettier-ignore
  inputs.addInput({ mode: "Orthogrpahic", type: "range", name: "left", min: -10, max: 0, step: 0.1, initialValue: -5, onInput: (value) => orthographicCamera.left = value });
  // prettier-ignore
  inputs.addInput({ mode: "Orthogrpahic", type: "range", name: "right", min: 0, max: 10, step: 0.1, initialValue: 5, onInput: (value) => orthographicCamera.right = value });
  // prettier-ignore
  inputs.addInput({ mode: "Orthogrpahic", type: "range", name: "bottom", min: -10, max: 0, step: 0.1, initialValue: -5, onInput: (value) => orthographicCamera.bottom = value });
  // prettier-ignore
  inputs.addInput({ mode: "Orthogrpahic", type: "range", name: "top", min: 0, max: 10, step: 0.1, initialValue: 5, onInput: (value) => orthographicCamera.top = value });

  let camera: Camera = perspectiveCamera;
  inputs.addModeChangeListener((mode) => {
    camera = mode === "Perspective" ? perspectiveCamera : orthographicCamera;
  });

  const shader = new Shader({
    code: shaderCode,
    geometry: cubeMesh.geometry,
    uniformDefinitions,
  });
  shader.setup(device, textureFormat);

  const cameraUniformGroup = shader.createUniformGroup("camera");
  const cubeUniformGroup = shader.createUniformGroup("model");
  const planeUniformGroup = shader.createUniformGroup("model");

  const floatx1 = new Float32Array(N1);
  const floatx3 = vec3.zero();
  const floatx16 = mat4.identity();

  const gpuRenderPassDescriptor = {
    colorAttachments: [
      {
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
        view: context.getCurrentTexture().createView(),
      },
    ],
  } satisfies GPURenderPassDescriptor;

  const colorArray = [0, 1, 0];

  const cubeTransform = new Transform();
  cubeTransform.px = -3;
  cubeTransform.rcx = 1;

  const planeTransform = new Transform();
  // @ts-expect-error - test
  planeTransform.NAME = "PLANE";
  planeTransform.px = 3;
  planeTransform.ox = 2;
  planeTransform.roz = 1;
  planeTransform.rcz = 1;
  planeTransform.sz = 0.0;
  planeTransform.sy = 0.1;

  const frame = (): void => {
    const commandEncoder = device.createCommandEncoder();
    gpuRenderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();
    const renderPass = commandEncoder.beginRenderPass(gpuRenderPassDescriptor);
    renderPass.setPipeline(shader.renderPipeline);

    floatx1.set([performance.now()]);
    cameraUniformGroup.writeBuffer("time", floatx1);
    camera.copyView(floatx16);
    cameraUniformGroup.writeBuffer("view", floatx16);
    camera.copyViewProjection(floatx16);
    cameraUniformGroup.writeBuffer("viewProjection", floatx16);
    floatx3.set(colorArray);
    cameraUniformGroup.writeBuffer("color", floatx3);

    cubeTransform.rcs = performance.now() / 250;
    cubeTransform.copyWorldTransform(floatx16);
    cubeUniformGroup.writeBuffer("model", floatx16);

    planeTransform.rcs = performance.now() / 250;
    planeTransform.ros = performance.now() / 250;
    planeTransform.copyWorldTransform(floatx16);
    planeUniformGroup.writeBuffer("model", floatx16);

    // Global bindings (Used for all draw calls)
    cameraUniformGroup.setBindGroup(renderPass);

    // Cube render
    renderPass.setVertexBuffer(0, cubeMesh.vertexBuffer);
    cubeUniformGroup.setBindGroup(renderPass);
    if (cubeMesh.geometry.indiced) {
      renderPass.setIndexBuffer(
        cubeMesh.indexBuffer,
        cubeMesh.geometry.indexFormat,
      );
      renderPass.drawIndexed(cubeMesh.geometry.drawCount);
    } else {
      renderPass.draw(cubeMesh.geometry.drawCount);
    }

    // Plane render
    renderPass.setVertexBuffer(0, planeMesh.vertexBuffer);
    planeUniformGroup.setBindGroup(renderPass);
    if (planeMesh.geometry.indiced) {
      renderPass.setIndexBuffer(
        planeMesh.indexBuffer,
        planeMesh.geometry.indexFormat,
      );
      renderPass.drawIndexed(planeMesh.geometry.drawCount);
    } else {
      renderPass.draw(planeMesh.geometry.drawCount);
    }

    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

void run();
