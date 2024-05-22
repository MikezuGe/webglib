import { mat4 } from "wgpu-matrix";

import { Transform } from "src/Transform";

export abstract class Camera {
  public readonly transform = new Transform();
  protected readonly _viewMatrix = mat4.identity();
  protected readonly _projectionMatrix = mat4.identity();
  protected readonly _viewProjectionMatrix = mat4.identity();
  protected _dirty = true;

  public copyView<T extends Float32Array>(f32Array: T): T {
    this._update();
    mat4.copy(this._viewMatrix, f32Array);
    return f32Array;
  }

  public copyProjection<T extends Float32Array>(f32Array: T): T {
    this._update();
    mat4.copy(this._projectionMatrix, f32Array);
    return f32Array;
  }

  public copyViewProjection<T extends Float32Array>(f32Array: T): T {
    this._update();
    mat4.copy(this._viewProjectionMatrix, f32Array);
    return f32Array;
  }

  protected _setDirty(): void {
    this._dirty = true;
  }

  private _update(): void {
    let updateViewProjection = false;
    if (this._dirty) {
      this._dirty = false;
      updateViewProjection = true;
      this._updateProjection();
    }
    if (this.transform.isDirty()) {
      updateViewProjection = true;
      this.transform.copyWorldTransform(this._viewMatrix);
      mat4.invert(this._viewMatrix, this._viewMatrix);
    }
    if (updateViewProjection) {
      // prettier-ignore
      mat4.multiply(this._projectionMatrix, this._viewMatrix, this._viewProjectionMatrix);
    }
  }

  public abstract set(properties: Record<string, unknown>): void;

  protected abstract _updateProjection(): void;
}
