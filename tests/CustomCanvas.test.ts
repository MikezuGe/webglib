import { CustomCanvas } from "src/CustomCanvas";
import {
  customCanvasWithCustomProperties,
  defaultCustomCanvas,
} from "./mocks/customCanvasMocks";

describe("CustomCanvas", () => {
  it("should create custom canvas", () => {
    const customCanvas = new CustomCanvas();
    expect(customCanvas).toBeInstanceOf(CustomCanvas);
  });

  it("should have default properties", () => {
    const mock = defaultCustomCanvas;
    const customCanvas = new CustomCanvas();
    expect(customCanvas.backgroundColor).toBe(mock.backgroundColor);
    expect(customCanvas.canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(customCanvas.height).toBe(mock.height);
    expect(customCanvas.left).toBe(mock.left);
    expect(customCanvas.top).toBe(mock.top);
    expect(customCanvas.width).toBe(mock.width);
  });

  it("should have custom properties", () => {
    const mock = customCanvasWithCustomProperties;
    const customCanvas = new CustomCanvas();
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
  });
});
