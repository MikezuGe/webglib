import { ReadinessState } from "src/utils";

import type { UniformDefinition, UniformGroupDefinition } from "./types";

export class UniformGroup<T extends UniformDefinition> {
  private readonly _bindGroupIndex: number;
  private readonly _bufferDefinitions: T["bufferDefinitions"];
  private readonly _writers = new Map<string, (data: ArrayBuffer) => void>();
  private _bindGroup?: GPUBindGroup;
  private readonly _state = new ReadinessState();

  public constructor(uniformDefinition: T) {
    this._bindGroupIndex = uniformDefinition.bindGroupIndex;
    this._bufferDefinitions = uniformDefinition.bufferDefinitions;
  }

  public setup(device: GPUDevice, renderPipeline: GPURenderPipeline): void {
    this._state.isStateOrThrow(ReadinessState.uninitialized);
    this._state.setState(ReadinessState.preparing);

    const entries = Object.entries(this._bufferDefinitions)
      .reduce<UniformGroupDefinition[]>(
        (acc, [name, { binding, offset, size }]) => {
          const bindingAcc = acc.find(({ binding: b }) => b === binding);
          if (bindingAcc) {
            bindingAcc.writers.push({ name, offset });
            bindingAcc.size += size;
          } else {
            acc.push({
              binding,
              size,
              writers: [{ name, offset }],
            });
          }
          return acc;
        },
        [],
      )
      .map(({ binding, size, writers }) => {
        const buffer = device.createBuffer({
          size,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        for (const { name, offset } of writers) {
          this._writers.set(name, (data): void =>
            device.queue.writeBuffer(buffer, offset, data),
          );
        }
        return {
          binding,
          resource: { buffer },
        };
      });

    this._bindGroup = device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(this._bindGroupIndex),
      entries,
    });

    this._state.setState(ReadinessState.initialized);
  }

  public writeBuffer(
    name: Extract<keyof T["bufferDefinitions"], string>,
    data: ArrayBuffer,
  ): void {
    this._writers.get(name)!(data);
  }

  public setBindGroup(encoder: GPURenderPassEncoder): void {
    encoder.setBindGroup(this._bindGroupIndex, this._bindGroup!);
  }
}
