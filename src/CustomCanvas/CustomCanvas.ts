import { CANVAS_DEFAULT_LEFT, CANVAS_DEFAULT_TOP } from "src/definitions";

export class CustomCanvas {
  public readonly canvas = document.createElement("canvas");
  private _width = window.innerWidth;
  private _height = window.innerHeight;
  private _backgroundColor = "gray";
  private _top = CANVAS_DEFAULT_TOP;
  private _left = CANVAS_DEFAULT_LEFT;
  private _aspectRatio = this._width / this._height;

  public constructor() {
    this.canvas.width = this._width;
    this.canvas.height = this._height;
    this.canvas.style.width = `${this._width}px`;
    this.canvas.style.height = `${this._height}px`;
    this.canvas.style.backgroundColor = this._backgroundColor;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = `${this._top}px`;
    this.canvas.style.left = `${this._left}px`;
    document.body.appendChild(this.canvas);
  }

  public get aspectRatio(): number {
    return this._aspectRatio;
  }

  public set width(value: number) {
    this._width = value;
    this.canvas.width = value;
    this.canvas.style.width = `${value}px`;
    this._aspectRatio = this._width / this._height;
  }

  public get width(): number {
    return this._width;
  }

  public set height(value: number) {
    this._height = value;
    this.canvas.height = value;
    this.canvas.style.height = `${value}px`;
    this._aspectRatio = this._width / this._height;
  }

  public get height(): number {
    return this._height;
  }

  public set backgroundColor(value: string) {
    this._backgroundColor = value;
    this.canvas.style.backgroundColor = value;
  }

  public get backgroundColor(): string {
    return this._backgroundColor;
  }

  public set top(value: number) {
    this._top = value;
    this.canvas.style.top = `${value}px`;
  }

  public get top(): number {
    return this._top;
  }

  public set left(value: number) {
    this._left = value;
    this.canvas.style.left = `${value}px`;
  }

  public get left(): number {
    return this._left;
  }
}
