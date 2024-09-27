import type {
  BindGroupLayoutEntriesByGroup,
  BindGroupLayoutsByGroup,
} from "../types";

export const createLayouts = (
  device: GPUDevice,
  bindGroupLayoutEntriesByGroup: BindGroupLayoutEntriesByGroup,
): {
  bindGroupLayoutsByGroup: BindGroupLayoutsByGroup;
  pipelineLayout: GPUPipelineLayout;
} => {
  const bindGroupLayoutsByGroup: BindGroupLayoutsByGroup = {};
  for (const group in bindGroupLayoutEntriesByGroup) {
    bindGroupLayoutsByGroup[group] = device.createBindGroupLayout({
      entries: bindGroupLayoutEntriesByGroup[group],
    });
  }
  const bindGroupLayouts: GPUBindGroupLayout[] = [];
  const sortedGroups = Object.keys(bindGroupLayoutsByGroup)
    .map((k) => Number(k))
    .toSorted((a, b) => a - b);
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
