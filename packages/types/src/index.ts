export type IAttribute = "color" | "normal" | "position";

export type I3DVector = [number, number, number];

export type ICubeFaceName =
  | "back"
  | "bottom"
  | "front"
  | "left"
  | "right"
  | "top";

export interface ICustomCanvas {
  /**
   * The canvas element
   */
  readonly canvasElement: HTMLCanvasElement;
  /**
   * Background color of the canvas, CSS string format.
   * @default "lightGray"
   * @example "red", "blue", "rgb(255, 0, 0)", "#FF0000", "rgba(255, 0, 0, 0.5)"
   */
  backgroundColor: string;
  /**
   * Top position of the canvas
   * @default 0
   */
  top: number;
  /**
   * Left position of the canvas
   * @default 0
   */
  left: number;
  /**
   * Width of the canvas
   * @default window.innerWidth
   */
  width: number;
  /**
   * Height of the canvas
   * @default window.innerHeight
   */
  height: number;
}

export interface ICanvasOptions {
  /**
   * The background color of the canvas
   */
  readonly backgroundColor?: string;
  /**
   * The top position of the canvas
   */
  readonly top?: number;
  /**
   * The left position of the canvas
   */
  readonly left?: number;
  /**
   * The width of the canvas
   */
  readonly width?: number;
  /**
   * The height of the canvas
   */
  readonly height?: number;
}

export interface IInitWebGPU {
  readonly adapter: GPUAdapter;
  readonly canvas: ICustomCanvas;
  readonly context: GPUCanvasContext;
  readonly device: GPUDevice;
}
