import {
  customCanvasWithCustomProperties,
  defaultCustomCanvas,
} from "/tests/mocks";

import { CustomCanvas } from "../CustomCanvas";

describe("CustomCanvas", () => {
  it("should create custom canvas", () => {
    const customCanvas = CustomCanvas.create();
    expect(customCanvas).toBeInstanceOf(CustomCanvas);
  });

  it("should have default properties", () => {
    const mock = defaultCustomCanvas;
    const customCanvas = CustomCanvas.create();
    expect(customCanvas.backgroundColor).toBe(mock.backgroundColor);
    expect(customCanvas.canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(customCanvas.height).toBe(mock.height);
    expect(customCanvas.left).toBe(mock.left);
    expect(customCanvas.top).toBe(mock.top);
    expect(customCanvas.width).toBe(mock.width);
    expect(customCanvas.aspectRatio).toBe(mock.aspectRatio);
  });

  it("should have custom properties", () => {
    const mock = customCanvasWithCustomProperties;
    const customCanvas = CustomCanvas.create();
    customCanvas.backgroundColor = mock.backgroundColor;
    customCanvas.height = mock.height;
    customCanvas.left = mock.left;
    customCanvas.top = mock.top;
    customCanvas.width = mock.width;
    expect(customCanvas.backgroundColor).toBe(mock.backgroundColor);
    expect(customCanvas.height).toBe(mock.height);
    expect(customCanvas.left).toBe(mock.left);
    expect(customCanvas.top).toBe(mock.top);
    expect(customCanvas.width).toBe(mock.width);
    expect(customCanvas.aspectRatio).toBe(mock.aspectRatio);
  });
});
