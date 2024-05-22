/* eslint-disable @typescript-eslint/no-magic-numbers */
import { mat4, vec3 } from "wgpu-matrix";

import { M00, M11, M22 } from "src/definitions";

import { Transform } from "../Transform";

describe("Transform", () => {
  let transform = new Transform();
  const expected = mat4.identity();
  const result = mat4.identity();
  const tempVec3 = vec3.zero();

  beforeEach(() => {
    transform = new Transform();
    mat4.identity(expected);
    mat4.identity(result);
    vec3.zero(tempVec3);
  });

  it("world is identity with pristine transform", () => {
    transform.copyWorldTransform(expected);
    mat4.identity(result);
    expect(expected).toEqual(result);
  });

  it("world applies position", () => {
    transform.px = 1;
    transform.py = 2;
    transform.pz = 3;
    transform.copyWorldTransform(expected);
    mat4.translation([transform.px, transform.py, transform.pz], result);
    expect(expected).toEqual(result);

    transform.setPosition([2, 3, 4]);
    transform.copyWorldTransform(expected);
    mat4.translation(transform.copyPosition(tempVec3), result);
    expect(expected).toEqual(result);
  });

  it("world applies origin", () => {
    transform.ox = 1;
    transform.oy = 2;
    transform.oz = 3;
    transform.copyWorldTransform(expected);
    mat4.translation([transform.ox, transform.oy, transform.oz], result);
    expect(expected).toEqual(result);

    transform.setOrigin([2, 3, 4]);
    transform.copyWorldTransform(expected);
    mat4.translation(transform.copyOrigin(tempVec3), result);
    expect(expected).toEqual(result);
  });

  it("world applies origin rotation", () => {
    transform.ox = 1;
    transform.rox = 1;
    transform.roy = 2;
    transform.roz = 3;
    transform.ros = 4;
    transform.copyWorldTransform(expected);
    // prettier-ignore
    mat4.axisRotation([transform.rox, transform.roy, transform.roz], transform.ros, result);
    mat4.translate(result, [transform.ox, transform.oy, transform.oz], result);
    expect(expected).toEqual(result);

    transform.setRotationOriginAxis([2, 3, 4]);
    transform.setRotationOriginScale(5);
    transform.copyWorldTransform(expected);
    // prettier-ignore
    mat4.axisRotation(transform.copyRotationOriginAxis(tempVec3), transform.getRotationOriginScale(), result);
    mat4.translate(result, [transform.ox, transform.oy, transform.oz], result);
    expect(expected).toEqual(result);
  });

  it("world applies center rotation", () => {
    transform.rcx = 1;
    transform.rcy = 2;
    transform.rcz = 3;
    transform.rcs = 4;
    transform.copyWorldTransform(expected);
    // prettier-ignore
    mat4.axisRotation([transform.rcx, transform.rcy, transform.rcz], transform.rcs, result);
    expect(expected).toEqual(result);

    transform.setRotationCenterAxis([2, 3, 4]);
    transform.setRotationCenterScale(5);
    transform.copyWorldTransform(expected);
    // prettier-ignore
    mat4.axisRotation(transform.copyRotationCenterAxis(tempVec3), transform.getRotationCenterScale(), result);
    expect(expected).toEqual(result);
  });

  it("world applies scale", () => {
    transform.sx = 1;
    transform.sy = 2;
    transform.sz = 3;
    transform.copyWorldTransform(expected);
    mat4.scaling([transform.sx, transform.sy, transform.sz], result);
    expect(expected).toEqual(result);

    transform.setScale([2, 3, 4]);
    transform.copyWorldTransform(expected);
    mat4.scaling(transform.copyScale(tempVec3), result);
    expect(expected).toEqual(result);
  });

  it("world applies all properties", () => {
    transform.px = 1;
    transform.py = 2;
    transform.pz = 3;
    transform.rox = 1;
    transform.roy = 2;
    transform.roz = 3;
    transform.ros = 4;
    transform.ox = 1;
    transform.oy = 2;
    transform.oz = 3;
    transform.rcx = 1;
    transform.rcy = 2;
    transform.rcz = 3;
    transform.rcs = 4;
    transform.sx = 1;
    transform.sy = 2;
    transform.sz = 3;
    transform.copyWorldTransform(expected);
    mat4.translate(result, [transform.px, transform.py, transform.pz], result);
    // prettier-ignore
    mat4.axisRotate(result, [transform.rox, transform.roy, transform.roz], transform.ros, result);
    mat4.translate(result, [transform.ox, transform.oy, transform.oz], result);
    // prettier-ignore
    mat4.axisRotate(result, [transform.rcx, transform.rcy, transform.rcz], transform.rcs, result);
    mat4.scale(result, [transform.sx, transform.sy, transform.sz], result);
    expect(expected).toEqual(result);
  });

  it("world applies zero scalar identity if at least 2 scalars are 0", () => {
    transform.setScale([0, 0, 0]);
    result[M00] = transform.sx;
    result[M11] = transform.sy;
    result[M22] = transform.sz;
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);

    transform.setScale([1, 0, 0]);
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);

    transform.setScale([0, 1, 0]);
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);

    transform.setScale([0, 0, 1]);
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });

  it("world applies scale if at least 2 scalars aren't 0", () => {
    transform.setScale([1, 1, 0]);
    result[M00] = transform.sx;
    result[M11] = transform.sy;
    result[M22] = transform.sz;
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);

    transform.setScale([1, 0, 1]);
    result[M00] = transform.sx;
    result[M11] = transform.sy;
    result[M22] = transform.sz;
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);

    transform.setScale([0, 1, 1]);
    result[M00] = transform.sx;
    result[M11] = transform.sy;
    result[M22] = transform.sz;
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });

  it("world doesn't apply origin rotation if origin is 0", () => {
    transform.ox = 0;
    transform.rox = 1;
    transform.ros = 1;
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });

  it("world doesn't apply origin rotation if origin rotation axis is 0", () => {
    transform.ox = 1;
    transform.rox = 0;
    transform.ros = 1;
    mat4.translation([transform.ox, transform.oy, transform.oz], result);
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });

  it("world doesn't apply origin rotation if origin rotation scale is 0", () => {
    transform.ox = 1;
    transform.rox = 1;
    transform.ros = 0;
    mat4.translation([transform.ox, transform.oy, transform.oz], result);
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });

  it("world doesn't apply center rotation if center rotation scale is 0", () => {
    transform.rcx = 1;
    transform.rcs = 0;
    // prettier-ignore
    mat4.axisRotation([transform.rcx, transform.rcy, transform.rcz], transform.rcs, result);
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });

  it("world doesn't apply center rotation if center rotation is 0", () => {
    transform.rcx = 0;
    transform.rcs = 1;
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });

  it("world doesn't update if not dirty", () => {
    transform.px = 1;
    // eslint-disable-next-line @typescript-eslint/dot-notation
    transform["_dirty"] = false;
    transform.copyWorldTransform(expected);
    expect(expected).toEqual(result);
  });
});
