import type { Renderable } from "../types";

const drawIndexed = (
  passEncoder: GPURenderPassEncoder,
  renderable: Renderable,
): void => {
  const {
    textureBindGroupIndex,
    modelBindGroupIndex,
    textureBindGroups,
    drawCount,
    indexBuffer,
    indexFormat,
  } = renderable;
  passEncoder.setIndexBuffer(indexBuffer!, indexFormat!);
  for (const { modelBindGroups, textureBindGroup } of textureBindGroups) {
    passEncoder.setBindGroup(textureBindGroupIndex, textureBindGroup);
    for (const bindGroup of modelBindGroups) {
      passEncoder.setBindGroup(modelBindGroupIndex, bindGroup);
      passEncoder.drawIndexed(drawCount);
    }
  }
};

const draw = (
  passEncoder: GPURenderPassEncoder,
  renderable: Renderable,
): void => {
  const {
    textureBindGroups,
    modelBindGroupIndex,
    textureBindGroupIndex,
    drawCount,
  } = renderable;
  for (const { modelBindGroups, textureBindGroup } of textureBindGroups) {
    passEncoder.setBindGroup(textureBindGroupIndex, textureBindGroup);
    for (const modelBindGroup of modelBindGroups) {
      passEncoder.setBindGroup(modelBindGroupIndex, modelBindGroup);
      passEncoder.draw(drawCount);
    }
  }
};

export const render = (
  passEncoder: GPURenderPassEncoder,
  renderables: Iterable<Renderable>,
): void => {
  for (const renderable of renderables) {
    passEncoder.setPipeline(renderable.renderPipeline);
    let i = 0;
    for (const buffer of renderable.vertexBuffers) {
      passEncoder.setVertexBuffer(i++, buffer);
    }
    if (renderable.indexBuffer) {
      drawIndexed(passEncoder, renderable);
    } else {
      draw(passEncoder, renderable);
    }
  }
};
