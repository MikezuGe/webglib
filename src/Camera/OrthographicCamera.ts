import { mat4 } from "wgpu-matrix";

import {
  ORTHOGRAPHIC_CAMERA_DEFAULT_BOTTOM,
  ORTHOGRAPHIC_CAMERA_DEFAULT_FAR,
  ORTHOGRAPHIC_CAMERA_DEFAULT_LEFT,
  ORTHOGRAPHIC_CAMERA_DEFAULT_NEAR,
  ORTHOGRAPHIC_CAMERA_DEFAULT_RIGHT,
  ORTHOGRAPHIC_CAMERA_DEFAULT_TOP,
} from "src/definitions";

import { Camera } from "./Camera";

export class OrthographicCamera extends Camera {
  private _left = ORTHOGRAPHIC_CAMERA_DEFAULT_LEFT;
  private _right = ORTHOGRAPHIC_CAMERA_DEFAULT_RIGHT;
  private _bottom = ORTHOGRAPHIC_CAMERA_DEFAULT_BOTTOM;
  private _top = ORTHOGRAPHIC_CAMERA_DEFAULT_TOP;
  private _near = ORTHOGRAPHIC_CAMERA_DEFAULT_NEAR;
  private _far = ORTHOGRAPHIC_CAMERA_DEFAULT_FAR;

  public get left(): number {
    return this._left;
  }

  public set left(left: number) {
    this._left = left;
    this._setDirty();
  }

  public get right(): number {
    return this._right;
  }

  public set right(right: number) {
    this._right = right;
    this._setDirty();
  }

  public get bottom(): number {
    return this._bottom;
  }

  public set bottom(bottom: number) {
    this._bottom = bottom;
    this._setDirty();
  }

  public get top(): number {
    return this._top;
  }

  public set top(top: number) {
    this._top = top;
    this._setDirty();
  }

  public get near(): number {
    return this._near;
  }

  public set near(near: number) {
    this._near = near;
    this._setDirty();
  }

  public get far(): number {
    return this._far;
  }

  public set far(far: number) {
    this._far = far;
    this._setDirty();
  }

  /**
   * Set any or all properties of the orthographic camera
   * @param properties - The properties to set. If a property is not set, default values is used.
   */
  public set({
    left = ORTHOGRAPHIC_CAMERA_DEFAULT_LEFT,
    right = ORTHOGRAPHIC_CAMERA_DEFAULT_RIGHT,
    bottom = ORTHOGRAPHIC_CAMERA_DEFAULT_BOTTOM,
    top = ORTHOGRAPHIC_CAMERA_DEFAULT_TOP,
    near = ORTHOGRAPHIC_CAMERA_DEFAULT_NEAR,
    far = ORTHOGRAPHIC_CAMERA_DEFAULT_FAR,
  }: {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
    near?: number;
    far?: number;
  } = {}): void {
    this._left = left;
    this._right = right;
    this._bottom = bottom;
    this._top = top;
    this._near = near;
    this._far = far;
    this._setDirty();
  }

  protected _updateProjection(): void {
    // prettier-ignore
    mat4.ortho(this._left, this._right, this._bottom, this._top, this._near, this._far, this._projectionMatrix);
  }
}
