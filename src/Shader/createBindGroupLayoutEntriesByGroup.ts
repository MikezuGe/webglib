import type { WgslReflect } from "wgsl_reflect";

import type { BindGroupLayoutEntriesByGroup } from "../types";

import { createVisibilityGetter } from "./createVisibilityGetter";

export const createBindGroupLayoutEntriesByGroup = (
  reflect: WgslReflect,
): BindGroupLayoutEntriesByGroup => {
  const getVisibility = createVisibilityGetter(reflect);
  const bindGroupLayoutEntriesByGroup: BindGroupLayoutEntriesByGroup = {};

  for (const u of reflect.uniforms) {
    const bindgroupLayoutEntries = bindGroupLayoutEntriesByGroup[u.group] ?? [];
    if (!bindgroupLayoutEntries.length) {
      bindGroupLayoutEntriesByGroup[u.group] = bindgroupLayoutEntries;
    }
    bindgroupLayoutEntries.push({
      binding: u.binding,
      visibility: getVisibility(u.name),
      buffer: {
        type: "uniform",
        hasDynamicOffset: false,
        minBindingSize: u.size,
      },
    });
  }

  for (const t of reflect.textures) {
    const bindgroupLayoutEntries = bindGroupLayoutEntriesByGroup[t.group] ?? [];
    if (!bindgroupLayoutEntries.length) {
      bindGroupLayoutEntriesByGroup[t.group] = bindgroupLayoutEntries;
    }
    bindgroupLayoutEntries.push({
      binding: t.binding,
      visibility: getVisibility(t.name),
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: false,
      },
    });
  }

  for (const s of reflect.samplers) {
    const bindgroupLayoutEntries = bindGroupLayoutEntriesByGroup[s.group] ?? [];
    if (!bindgroupLayoutEntries.length) {
      bindGroupLayoutEntriesByGroup[s.group] = bindgroupLayoutEntries;
    }
    bindgroupLayoutEntries.push({
      binding: s.binding,
      visibility: getVisibility(s.name),
      sampler: {
        type: "filtering",
      },
    });
  }

  for (const key in bindGroupLayoutEntriesByGroup) {
    bindGroupLayoutEntriesByGroup[key].sort((a, b) => a.binding - b.binding);
  }

  return bindGroupLayoutEntriesByGroup;
};
