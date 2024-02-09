import type { ICanvasOptions, ICustomCanvas } from "./types";

const zero = 0;

export class CustomCanvas implements ICustomCanvas {
  public readonly canvasElement = document.createElement("canvas");
  private _backgroundColor = "lightGray";
  private _width = window.innerWidth;
  private _height = window.innerHeight;
  private _top = zero;
  private _left = zero;

  public constructor(options: ICanvasOptions = {}) {
    this.canvasElement.style.position = "absolute";
    this.backgroundColor = options.backgroundColor ?? this.backgroundColor;
    this.width = options.width ?? this.width;
    this.height = options.height ?? this.height;
    this.top = options.top ?? this.top;
    this.left = options.left ?? this.left;
    document.body.appendChild(this.canvasElement);
  }

  public get backgroundColor(): string {
    return this._backgroundColor;
  }

  public set backgroundColor(color: string) {
    this._backgroundColor = color;
    this.canvasElement.style.backgroundColor = color;
  }

  public get top(): number {
    return this._top;
  }

  public set top(top: number) {
    this._top = top;
    this.canvasElement.style.top = `${top}px`;
  }

  public get left(): number {
    return this._left;
  }

  public set left(left: number) {
    this._left = left;
    this.canvasElement.style.left = `${left}px`;
  }

  public get width(): number {
    return this._width;
  }

  public set width(width: number) {
    if (width <= zero) {
      throw new Error(`Width must be greater than ${zero}`);
    }
    this._width = width;
    this.canvasElement.width = width;
    this.canvasElement.style.width = `${width}px`;
  }

  public get height(): number {
    return this._height;
  }

  public set height(height: number) {
    if (height <= zero) {
      throw new Error(`Height must be greater than ${zero}`);
    }
    this._height = height;
    this.canvasElement.height = height;
    this.canvasElement.style.height = `${height}px`;
  }
}
