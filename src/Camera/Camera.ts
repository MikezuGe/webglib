import { Transform } from "src/Transform";
import { MAT4_SIZE, PROJECTION_DIRTY } from "src/definitions";
import { mat4 } from "wgpu-matrix";

export abstract class Camera {
  public readonly transform = new Transform();
  protected readonly _viewMatrix = new Float32Array(MAT4_SIZE);
  protected readonly _projectionMatrix = new Float32Array(MAT4_SIZE);
  protected readonly _viewProjectionMatrix = new Float32Array(MAT4_SIZE);
  protected _dirtyFlags = PROJECTION_DIRTY;

  public copyView(f32Array = new Float32Array(MAT4_SIZE)): Float32Array {
    this._update();
    return mat4.copy(this._viewMatrix, f32Array) as Float32Array;
  }

  public copyProjection(f32Array = new Float32Array(MAT4_SIZE)): Float32Array {
    this._update();
    return mat4.copy(this._projectionMatrix, f32Array) as Float32Array;
  }

  public copyViewProjection(
    f32Array = new Float32Array(MAT4_SIZE)
  ): Float32Array {
    this._update();
    return mat4.copy(this._viewProjectionMatrix, f32Array) as Float32Array;
  }

  protected _setDirty(dirtyFlags: number): void {
    this._dirtyFlags |= dirtyFlags;
  }

  private _update(): void {
    if (!this._dirtyFlags) {
      return;
    }
    if (this._dirtyFlags & PROJECTION_DIRTY) {
      this._updateProjection();
      this._dirtyFlags ^= PROJECTION_DIRTY;
    }
    this.transform.copyWorldTransform(this._viewMatrix);
    mat4.invert(this._viewMatrix, this._viewMatrix);
    mat4.multiply(
      this._projectionMatrix,
      this._viewMatrix,
      this._viewProjectionMatrix
    );
  }

  protected abstract _updateProjection(): void;
}
