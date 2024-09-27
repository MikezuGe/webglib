import type { SamplerDescriptor } from "../types";

export const createSampler = (
  device: GPUDevice,
  samplerDescriptor: GPUSamplerDescriptor,
): GPUSampler => {
  const sampler = device.createSampler(samplerDescriptor);
  return sampler;
};

export const createSamplers = (
  device: GPUDevice,
  samplerDescriptors: SamplerDescriptor[],
  samplerDataMap: Record<string, GPUSamplerDescriptor>,
): Record<string, GPUSampler> => {
  const samplersByName: Record<string, GPUSampler> = {};
  for (const s of samplerDescriptors) {
    const samplerDescriptor = samplerDataMap[s.name];
    const sampler = device.createSampler(samplerDescriptor);
    samplersByName[s.name] = sampler;
  }
  return samplersByName;
};
