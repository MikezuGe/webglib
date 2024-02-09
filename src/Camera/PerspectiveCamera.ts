import { mat4 } from "wgpu-matrix";

import {
  PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO,
  PERSPECTIVE_CAMERA_DEFAULT_FAR,
  PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG,
  PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_RAD,
  PERSPECTIVE_CAMERA_DEFAULT_NEAR,
  PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_DEG,
  PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_RAD,
  PERSPECTIVE_CAMERA_MIN_ASPECT_RATIO,
  PERSPECTIVE_CAMERA_MIN_FAR,
  PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_DEG,
  PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_RAD,
  PERSPECTIVE_CAMERA_MIN_NEAR,
} from "../definitions";
import { degToRad, radToDeg } from "../utils";

import { Camera } from "./Camera";

export class PerspectiveCamera extends Camera {
  private _aspectRatio = PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO;
  private _fieldOfViewDeg = PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG;
  private _fieldOfViewRad = PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_RAD;
  private _near = PERSPECTIVE_CAMERA_DEFAULT_NEAR;
  private _far = PERSPECTIVE_CAMERA_DEFAULT_FAR;

  public get aspectRatio(): number {
    return this._aspectRatio;
  }

  public set aspectRatio(aspectRatio: number) {
    if (aspectRatio === this._aspectRatio) {
      return;
    }
    if (aspectRatio < PERSPECTIVE_CAMERA_MIN_ASPECT_RATIO) {
      throw new Error(
        `Aspect ratio must be greater than ${PERSPECTIVE_CAMERA_MIN_ASPECT_RATIO}`,
      );
    }
    this._aspectRatio = aspectRatio;
    this._setDirty();
  }

  public get fieldOfViewDeg(): number {
    return this._fieldOfViewDeg;
  }

  public set fieldOfViewDeg(fieldOfView: number) {
    if (fieldOfView === this._fieldOfViewDeg) {
      return;
    }
    if (fieldOfView < PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_DEG) {
      throw new Error(
        `Field of view must be greater than ${PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_DEG}`,
      );
    }
    if (fieldOfView > PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_DEG) {
      throw new Error(
        `Field of view must be less than ${PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_DEG}`,
      );
    }

    this._fieldOfViewDeg = fieldOfView;
    this._fieldOfViewRad = degToRad(fieldOfView);
    this._setDirty();
  }

  public get fieldOfViewRad(): number {
    return this._fieldOfViewRad;
  }

  public set fieldOfViewRad(fieldOfView: number) {
    if (fieldOfView === this._fieldOfViewRad) {
      return;
    }
    if (fieldOfView < PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_RAD) {
      throw new Error(
        `Field of view must be greater than ${PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_RAD}`,
      );
    }
    if (fieldOfView > PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_RAD) {
      throw new Error(
        `Field of view must be less than ${PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_RAD}`,
      );
    }
    this._fieldOfViewRad = fieldOfView;
    this._fieldOfViewDeg = radToDeg(fieldOfView);
    this._setDirty();
  }

  public get near(): number {
    return this._near;
  }

  public set near(near: number) {
    if (near === this._near) {
      return;
    }
    if (near < PERSPECTIVE_CAMERA_MIN_NEAR) {
      throw new Error(
        `Near must be greater than ${PERSPECTIVE_CAMERA_MIN_NEAR}`,
      );
    }
    if (near >= this._far) {
      throw new Error("Near must be less than far");
    }
    this._near = near;
    this._setDirty();
  }

  public get far(): number {
    return this._far;
  }

  public set far(far: number) {
    if (far === this._far) {
      return;
    }
    if (far < PERSPECTIVE_CAMERA_MIN_FAR) {
      throw new Error(`Far must be greater than ${PERSPECTIVE_CAMERA_MIN_FAR}`);
    }
    if (far <= this._near) {
      throw new Error("Far must be greater than near");
    }
    this._far = far;
    this._setDirty();
  }

  /**
   * Set any or all properties of the perspective camera
   * @param properties - The properties to set
   * @param properties.aspectRatio - The aspect ratio of the camera
   * @param properties.fieldOfViewDeg - The field of view of the camera in degrees. If both fieldOfViewDeg and fieldOfViewRad are provided, fieldOfViewRad will be used
   * @param properties.fieldOfViewRad - The field of view of the camera in radians. If both fieldOfViewDeg and fieldOfViewRad are provided, fieldOfViewRad will be used
   * @param properties.near - The near plane of the camera
   * @param properties.far - The far plane of the camera
   * @returns void
   */
  public set({
    aspectRatio,
    fieldOfViewDeg,
    fieldOfViewRad,
    near,
    far,
  }: {
    aspectRatio?: number;
    fieldOfViewDeg?: number;
    fieldOfViewRad?: number;
    near?: number;
    far?: number;
  }): void {
    if (aspectRatio !== undefined) {
      this.aspectRatio = aspectRatio;
    }
    if (fieldOfViewRad !== undefined) {
      this.fieldOfViewRad = fieldOfViewRad;
      this.fieldOfViewDeg = radToDeg(fieldOfViewRad);
    } else if (fieldOfViewDeg !== undefined) {
      this.fieldOfViewDeg = fieldOfViewDeg;
      this.fieldOfViewRad = degToRad(fieldOfViewDeg);
    }
    if (near !== undefined) {
      this.near = near;
    }
    if (far !== undefined) {
      this.far = far;
    }
  }

  protected _updateProjection(): void {
    // prettier-ignore
    mat4.perspective(this._fieldOfViewRad, this._aspectRatio, this._near, this._far, this._projectionMatrix);
  }
}
