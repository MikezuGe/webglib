import {
  MAT4_SIZE,
  ONE,
  ORIGIN_DIRTY,
  POSITION_DIRTY,
  ROTATION_DIRTY,
  SCALE_DIRTY,
  TWO,
  ZERO,
} from "src/definitions";
import { vec3, mat4, quat } from "wgpu-matrix";

export class Transform {
  private readonly _worldTransform = new Float32Array(MAT4_SIZE);
  private readonly _originMatrix = new Float32Array(MAT4_SIZE);
  private readonly _rotationMatrix = new Float32Array(MAT4_SIZE);
  private readonly _positionMatrix = new Float32Array(MAT4_SIZE);
  private readonly _scaleMatrix = new Float32Array(MAT4_SIZE);
  private readonly _origin = vec3.zero();
  private readonly _rotation = quat.identity();
  private readonly _position = vec3.zero();
  private readonly _scale = vec3.create(ONE, ONE, ONE);
  private _dirtyFlags =
    POSITION_DIRTY | ROTATION_DIRTY | SCALE_DIRTY | ORIGIN_DIRTY;

  public get px(): number {
    return this._position[ZERO];
  }

  public set px(px: number) {
    this._position[ZERO] = px;
    this.setDirty(POSITION_DIRTY);
  }

  public get py(): number {
    return this._position[ONE];
  }

  public set py(py: number) {
    this._position[ONE] = py;
    this.setDirty(POSITION_DIRTY);
  }

  public get pz(): number {
    return this._position[TWO];
  }

  public set pz(pz: number) {
    this._position[TWO] = pz;
    this.setDirty(POSITION_DIRTY);
  }

  // Implement rotation properties here

  public get sx(): number {
    return this._scale[ZERO];
  }

  public set sx(sx: number) {
    this._scale[ZERO] = sx;
    this.setDirty(SCALE_DIRTY);
  }

  public get sy(): number {
    return this._scale[ONE];
  }

  public set sy(sy: number) {
    this._scale[ONE] = sy;
    this.setDirty(SCALE_DIRTY);
  }

  public get sz(): number {
    return this._scale[TWO];
  }

  public set sz(sz: number) {
    this._scale[TWO] = sz;
    this.setDirty(SCALE_DIRTY);
  }

  public get ox(): number {
    return this._origin[ZERO];
  }

  public set ox(ox: number) {
    this._origin[ZERO] = ox;
    this.setDirty(ORIGIN_DIRTY);
  }

  public get oy(): number {
    return this._origin[ONE];
  }

  public set oy(oy: number) {
    this._origin[ONE] = oy;
    this.setDirty(ORIGIN_DIRTY);
  }

  public get oz(): number {
    return this._origin[TWO];
  }

  public set oz(oz: number) {
    this._origin[TWO] = oz;
    this.setDirty(ORIGIN_DIRTY);
  }

  public copyWorldTransform(
    f32Array = new Float32Array(MAT4_SIZE)
  ): Float32Array {
    this._updateWorldTransform();
    return mat4.copy(this._worldTransform, f32Array) as Float32Array;
  }

  private setDirty(dirtyFlags: number): void {
    this._dirtyFlags |= dirtyFlags;
  }

  private _updateWorldTransform(): void {
    if (!this._dirtyFlags) {
      return;
    }
    if (this._dirtyFlags & ORIGIN_DIRTY) {
      mat4.translation(this._origin, this._originMatrix);
      this._dirtyFlags ^= ORIGIN_DIRTY;
    }
    if (this._dirtyFlags & ROTATION_DIRTY) {
      mat4.fromQuat(this._rotation, this._rotationMatrix);
      this._dirtyFlags ^= ROTATION_DIRTY;
    }
    if (this._dirtyFlags & POSITION_DIRTY) {
      mat4.translation(this._position, this._positionMatrix);
      this._dirtyFlags ^= POSITION_DIRTY;
    }
    if (this._dirtyFlags & SCALE_DIRTY) {
      mat4.scaling(this._scale, this._scaleMatrix);
      this._dirtyFlags ^= SCALE_DIRTY;
    }
    mat4.identity(this._worldTransform);
    mat4.multiply(
      this._worldTransform,
      this._originMatrix,
      this._worldTransform
    );
    mat4.multiply(
      this._worldTransform,
      this._rotationMatrix,
      this._worldTransform
    );
    mat4.multiply(
      this._worldTransform,
      this._positionMatrix,
      this._worldTransform
    );
    mat4.multiply(
      this._worldTransform,
      this._scaleMatrix,
      this._worldTransform
    );
  }
}
