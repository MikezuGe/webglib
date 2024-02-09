import { mat4 } from "wgpu-matrix";
import { Camera } from "./Camera";
import { degToRad } from "src/utils";
import { PROJECTION_DIRTY } from "src/definitions";

const DEFAULT_ASPECT_RATIO = 1;
const DEFAULT_FIELD_OF_VIEW = 60;
const DEFAULT_NEAR = 0.1;
const DEFAULT_FAR = 100;

export class PerspectiveCamera extends Camera {
  private _aspectRatio = DEFAULT_ASPECT_RATIO;
  private _fieldOfView = DEFAULT_FIELD_OF_VIEW;
  private _near = DEFAULT_NEAR;
  private _far = DEFAULT_FAR;

  public get aspectRatio(): number {
    return this._aspectRatio;
  }

  public set aspectRatio(aspectRatio: number) {
    this._aspectRatio = aspectRatio;
    this._setDirty(PROJECTION_DIRTY);
  }

  public get fieldOfView(): number {
    return this._fieldOfView;
  }

  public set fieldOfView(fieldOfView: number) {
    this._fieldOfView = fieldOfView;
    this._setDirty(PROJECTION_DIRTY);
  }

  public get near(): number {
    return this._near;
  }

  public set near(near: number) {
    this._near = near;
    this._setDirty(PROJECTION_DIRTY);
  }

  public get far(): number {
    return this._far;
  }

  public set far(far: number) {
    this._far = far;
    this._setDirty(PROJECTION_DIRTY);
  }

  protected _updateProjection(): void {
    mat4.perspective(
      degToRad(this._fieldOfView),
      this._aspectRatio,
      this._near,
      this._far,
      this._projectionMatrix
    );
  }
}
