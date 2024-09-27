import type { UniformDescriptor, UniformName } from "../types";
import { assertExists } from "../utils";

export const createUniformWriter = <
  U extends UniformName,
  M extends object,
  K extends U,
  MK extends Extract<
    UniformDescriptor<K, M>["writerDescriptors"][number]["name"],
    string
  >,
>({
  device,
  uniformDescriptors,
  uniformBuffer,
  name,
}: {
  device: GPUDevice;
  uniformDescriptors: UniformDescriptor<U, M>[];
  uniformBuffer: GPUBuffer;
  name: K;
}): {
  [A in MK]: (value: Float32Array) => void;
} => {
  const writers = {} as Record<MK, (value: Float32Array) => void>;
  const uniformDescriptor = uniformDescriptors.find((u) => u.name === name);
  assertExists(
    uniformDescriptor,
    `Uniform descriptor not found for uniform '${name}'`,
  );
  for (const w of uniformDescriptor.writerDescriptors) {
    writers[w.name as MK] = (value: Float32Array): void => {
      device.queue.writeBuffer(uniformBuffer, w.offset, value);
    };
  }
  return writers;
};
