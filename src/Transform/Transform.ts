import { mat4, vec3 } from "wgpu-matrix";
import type { BaseArgType } from "wgpu-matrix";

import { M00, M11, M22, N0, N1, N2 } from "src/definitions";

export class Transform {
  private _dirty = true;
  // prettier-ignore
  private readonly _worldTransform = mat4.identity();
  private readonly _position = vec3.create(N0, N0, N0);
  private readonly _rotationOriginAxis = vec3.create(N0, N0, N0);
  private _rotationOriginScale = N0;
  private readonly _origin = vec3.create(N0, N0, N0);
  private readonly _rotationCenterAxis = vec3.create(N0, N0, N0);
  private _rotationCenterScale = N0;
  private readonly _scale = vec3.create(N1, N1, N1);

  public get px(): number {
    return this._position[N0];
  }

  public set px(px: number) {
    this._position[N0] = px;
    this._setDirty();
  }

  public get py(): number {
    return this._position[N1];
  }

  public set py(py: number) {
    this._position[N1] = py;
    this._setDirty();
  }

  public get pz(): number {
    return this._position[N2];
  }

  public set pz(pz: number) {
    this._position[N2] = pz;
    this._setDirty();
  }

  public set rox(rox: number) {
    this._rotationOriginAxis[N0] = rox;
    this._setDirty();
  }

  public get rox(): number {
    return this._rotationOriginAxis[N0];
  }

  public set roy(roy: number) {
    this._rotationOriginAxis[N1] = roy;
    this._setDirty();
  }

  public get roy(): number {
    return this._rotationOriginAxis[N1];
  }

  public set roz(roz: number) {
    this._rotationOriginAxis[N2] = roz;
    this._setDirty();
  }

  public get roz(): number {
    return this._rotationOriginAxis[N2];
  }

  public set ros(ros: number) {
    this._rotationOriginScale = ros;
    this._setDirty();
  }

  public get ros(): number {
    return this._rotationOriginScale;
  }

  public get ox(): number {
    return this._origin[N0];
  }

  public set ox(ox: number) {
    this._origin[N0] = ox;
    this._setDirty();
  }

  public get oy(): number {
    return this._origin[N1];
  }

  public set oy(oy: number) {
    this._origin[N1] = oy;
    this._setDirty();
  }

  public get oz(): number {
    return this._origin[N2];
  }

  public set oz(oz: number) {
    this._origin[N2] = oz;
    this._setDirty();
  }

  public get rcx(): number {
    return this._rotationCenterAxis[N0];
  }

  public set rcx(rx: number) {
    this._rotationCenterAxis[N0] = rx;
    this._setDirty();
  }

  public get rcy(): number {
    return this._rotationCenterAxis[N1];
  }

  public set rcy(ry: number) {
    this._rotationCenterAxis[N1] = ry;
    this._setDirty();
  }

  public get rcz(): number {
    return this._rotationCenterAxis[N2];
  }

  public set rcz(rz: number) {
    this._rotationCenterAxis[N2] = rz;
    this._setDirty();
  }

  public get rcs(): number {
    return this._rotationCenterScale;
  }

  public set rcs(rs: number) {
    this._rotationCenterScale = rs;
    this._setDirty();
  }

  public get sx(): number {
    return this._scale[N0];
  }

  public set sx(sx: number) {
    this._scale[N0] = sx;
    this._setDirty();
  }

  public get sy(): number {
    return this._scale[N1];
  }

  public set sy(sy: number) {
    this._scale[N1] = sy;
    this._setDirty();
  }

  public get sz(): number {
    return this._scale[N2];
  }

  public set sz(sz: number) {
    this._scale[N2] = sz;
    this._setDirty();
  }

  public setPosition(position: BaseArgType): void {
    vec3.copy(position, this._position);
    this._setDirty();
  }

  public copyPosition<T extends Float32Array>(f32Array: T): T {
    vec3.copy(this._position, f32Array);
    return f32Array;
  }

  public setRotationOriginAxis(axis: BaseArgType): void {
    vec3.copy(axis, this._rotationOriginAxis);
    this._setDirty();
  }

  public copyRotationOriginAxis<T extends Float32Array>(f32Array: T): T {
    vec3.copy(this._rotationOriginAxis, f32Array);
    return f32Array;
  }

  public setRotationOriginScale(scale: number): void {
    this._rotationOriginScale = scale;
    this._setDirty();
  }

  public getRotationOriginScale(): number {
    return this._rotationOriginScale;
  }

  public setOrigin(origin: BaseArgType): void {
    vec3.copy(origin, this._origin);
    this._setDirty();
  }

  public copyOrigin<T extends Float32Array>(f32Array: T): T {
    vec3.copy(this._origin, f32Array);
    return f32Array;
  }

  public setRotationCenterAxis(axis: BaseArgType): void {
    vec3.copy(axis, this._rotationCenterAxis);
    this._setDirty();
  }

  public copyRotationCenterAxis<T extends Float32Array>(f32Array: T): T {
    vec3.copy(this._rotationCenterAxis, f32Array);
    return f32Array;
  }

  public setRotationCenterScale(scale: number): void {
    this._rotationCenterScale = scale;
    this._setDirty();
  }

  public getRotationCenterScale(): number {
    return this._rotationCenterScale;
  }

  public setScale(scale: BaseArgType): void {
    vec3.copy(scale, this._scale);
    this._setDirty();
  }

  public copyScale<T extends Float32Array>(f32Array: T): T {
    vec3.copy(this._scale, f32Array);
    return f32Array;
  }

  public copyWorldTransform<T extends Float32Array>(f32Array: T): T {
    this._updateWorldTransform();
    mat4.copy(this._worldTransform, f32Array);
    return f32Array;
  }

  public isDirty(): boolean {
    return this._dirty;
  }

  private _setDirty(): void {
    this._dirty = true;
  }

  private _updateWorldTransform(): void {
    if (!this._dirty) {
      return;
    }
    this._dirty = false;

    let scalars = 0;
    if (this._scale[N0] !== N0) scalars++;
    if (this._scale[N1] !== N0) scalars++;
    if (this._scale[N2] !== N0) scalars++;
    const applyScale = scalars >= N2;

    const {
      _worldTransform,
      _position,
      _rotationOriginAxis,
      _rotationOriginScale,
      _origin,
      _rotationCenterAxis,
      _rotationCenterScale,
      _scale,
    } = this;

    mat4.identity(_worldTransform);

    if (!applyScale) {
      // If scale is not applied in at least 2 dimensions, then the object is a point, thus no need to apply any transformation.
      _worldTransform[M00] = N0;
      _worldTransform[M11] = N0;
      _worldTransform[M22] = N0;
      return;
    }

    const applyOriginRotation =
      _rotationOriginScale !== N0 &&
      (_origin[N0] !== N0 || _origin[N1] !== N0 || _origin[N2] !== N0) &&
      (_rotationOriginAxis[N0] !== N0 ||
        _rotationOriginAxis[N1] !== N0 ||
        _rotationOriginAxis[N2] !== N0);
    const applyCenterRotation =
      _rotationCenterScale !== N0 &&
      (_rotationCenterAxis[N0] !== N0 ||
        _rotationCenterAxis[N1] !== N0 ||
        _rotationCenterAxis[N2] !== N0);

    mat4.translate(_worldTransform, _position, _worldTransform);

    if (applyOriginRotation) {
      // prettier-ignore
      mat4.rotate(_worldTransform, _rotationOriginAxis, _rotationOriginScale, _worldTransform);
    }

    mat4.translate(_worldTransform, _origin, _worldTransform);

    if (applyCenterRotation) {
      // prettier-ignore
      mat4.rotate(_worldTransform, _rotationCenterAxis, _rotationCenterScale, _worldTransform);
    }

    mat4.scale(_worldTransform, _scale, _worldTransform);
  }
}
