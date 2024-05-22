import { mat4 } from "wgpu-matrix";

import {
  PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO,
  PERSPECTIVE_CAMERA_DEFAULT_FAR,
  PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG,
  PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_RAD,
  PERSPECTIVE_CAMERA_DEFAULT_NEAR,
} from "src/definitions";
import { degToRad, radToDeg } from "src/utils";

import { Camera } from "./Camera";

export class PerspectiveCamera extends Camera {
  private _aspectRatio = PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO;
  private _fieldOfView = PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG;
  private _fieldOfViewRad = PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_RAD;
  private _near = PERSPECTIVE_CAMERA_DEFAULT_NEAR;
  private _far = PERSPECTIVE_CAMERA_DEFAULT_FAR;

  public get aspectRatio(): number {
    return this._aspectRatio;
  }

  public set aspectRatio(aspectRatio: number) {
    this._aspectRatio = aspectRatio;
    this._setDirty();
  }

  public get fieldOfView(): number {
    return this._fieldOfView;
  }

  public set fieldOfView(fieldOfView: number) {
    this._fieldOfView = fieldOfView;
    this._fieldOfViewRad = degToRad(fieldOfView);
    this._setDirty();
  }

  public get fieldOfViewRad(): number {
    return this._fieldOfViewRad;
  }

  public set fieldOfViewRad(fieldOfView: number) {
    this._fieldOfView = fieldOfView;
    this._fieldOfViewRad = radToDeg(fieldOfView);
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
   * Set any or all properties of the perspective camera
   * @param properties - The properties to set. If a property is not set, default values is used.
   */
  public set({
    aspectRatio = PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO,
    fieldOfView = PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG,
    near = PERSPECTIVE_CAMERA_DEFAULT_NEAR,
    far = PERSPECTIVE_CAMERA_DEFAULT_FAR,
  }: {
    aspectRatio?: number;
    fieldOfView?: number;
    near?: number;
    far?: number;
  } = {}): void {
    this._aspectRatio = aspectRatio;
    this._fieldOfView = fieldOfView;
    this._fieldOfViewRad = degToRad(fieldOfView);
    this._near = near;
    this._far = far;
    this._setDirty();
  }

  protected _updateProjection(): void {
    // prettier-ignore
    mat4.perspective(this._fieldOfViewRad, this._aspectRatio, this._near, this._far, this._projectionMatrix);
  }
}
