// Mock navigator getPreferredCanvasFormat
Object.assign(global.navigator, {
  gpu: { getPreferredCanvasFormat: (): GPUTextureFormat => "rgba8unorm" },
});
