import { CustomCanvas } from "../src";
import { canvasOptionsMock } from "./mocks";

describe("Custom canvas", () => {
  it("should create a custom canvas", () => {
    const customCanvas = new CustomCanvas();
    const { canvasElement } = customCanvas;

    expect(customCanvas.backgroundColor).toBe("lightGray");
    expect(customCanvas.height).toBe(window.innerHeight);
    expect(customCanvas.width).toBe(window.innerWidth);
    expect(customCanvas.top).toBe(0);
    expect(customCanvas.left).toBe(0);
    expect(canvasElement.style.position).toBe("absolute");
    expect(canvasElement.style.backgroundColor).toBe("lightGray");
    expect(canvasElement.height).toBe(window.innerHeight);
    expect(canvasElement.style.height).toBe(`${window.innerHeight}px`);
    expect(canvasElement.width).toBe(window.innerWidth);
    expect(canvasElement.style.width).toBe(`${window.innerWidth}px`);
    expect(canvasElement.style.top).toBe("0px");
    expect(canvasElement.style.left).toBe("0px");
  });

  it("should create a custom canvas with options", () => {
    const customCanvas = new CustomCanvas(canvasOptionsMock);
    const { canvasElement } = customCanvas;

    expect(customCanvas.backgroundColor).toBe(
      canvasOptionsMock.backgroundColor
    );
    expect(customCanvas.height).toBe(canvasOptionsMock.height);
    expect(customCanvas.width).toBe(canvasOptionsMock.width);
    expect(customCanvas.top).toBe(canvasOptionsMock.top);
    expect(customCanvas.left).toBe(canvasOptionsMock.left);
    expect(canvasElement.style.position).toBe("absolute");
    expect(canvasElement.style.backgroundColor).toBe(
      canvasOptionsMock.backgroundColor
    );
    expect(canvasElement.height).toBe(canvasOptionsMock.height);
    expect(canvasElement.style.height).toBe(`${canvasOptionsMock.height}px`);
    expect(canvasElement.width).toBe(canvasOptionsMock.width);
    expect(canvasElement.style.width).toBe(`${canvasOptionsMock.width}px`);
    expect(canvasElement.style.top).toBe(`${canvasOptionsMock.top}px`);
    expect(canvasElement.style.left).toBe(`${canvasOptionsMock.left}px`);
  });
});

describe("Custom canvas methods", () => {
  const customCanvas = new CustomCanvas();
  const { canvasElement } = customCanvas;

  const minusOne = -1;
  const zero = 0;

  it("should set background color", () => {
    customCanvas.backgroundColor = "black";
    expect(customCanvas.backgroundColor).toBe("black");
    expect(canvasElement.style.backgroundColor).toBe("black");
  });

  it("should set width", () => {
    customCanvas.width = canvasOptionsMock.width;
    expect(canvasElement.width).toBe(canvasOptionsMock.width);
    expect(canvasElement.style.width).toBe(`${canvasOptionsMock.width}px`);
  });

  it("should set height", () => {
    customCanvas.height = canvasOptionsMock.height;
    expect(canvasElement.height).toBe(canvasOptionsMock.height);
    expect(canvasElement.style.height).toBe(`${canvasOptionsMock.height}px`);
  });

  it("should throw an error when width is less than or equal to 0", () => {
    expect(() => {
      customCanvas.width = minusOne;
    }).toThrow("Width must be greater than 0");
    expect(() => {
      customCanvas.width = zero;
    }).toThrow("Width must be greater than 0");
  });

  it("should throw an error when height is less than or equal to 0", () => {
    expect(() => {
      customCanvas.height = minusOne;
    }).toThrow("Height must be greater than 0");
    expect(() => {
      customCanvas.height = zero;
    }).toThrow("Height must be greater than 0");
  });

  it("should set top position", () => {
    customCanvas.top = canvasOptionsMock.top;
    expect(customCanvas.top).toBe(canvasOptionsMock.top);
    expect(canvasElement.style.top).toBe(`${canvasOptionsMock.top}px`);
  });

  it("should set left position", () => {
    customCanvas.left = canvasOptionsMock.left;
    expect(customCanvas.left).toBe(canvasOptionsMock.left);
    expect(canvasElement.style.left).toBe(`${canvasOptionsMock.left}px`);
  });
});
