import { mat4 } from "wgpu-matrix";

import {
  ORTHOGRAPHIC_CAMERA_DEFAULT_BOTTOM as bottom,
  ORTHOGRAPHIC_CAMERA_DEFAULT_FAR as far,
  ORTHOGRAPHIC_CAMERA_DEFAULT_LEFT as left,
  ORTHOGRAPHIC_CAMERA_DEFAULT_NEAR as near,
  ORTHOGRAPHIC_CAMERA_DEFAULT_RIGHT as right,
  ORTHOGRAPHIC_CAMERA_DEFAULT_TOP as top,
} from "src/definitions";

import { OrthographicCamera } from "../OrthographicCamera";

describe("Orthographic camera", () => {
  let camera = new OrthographicCamera();
  const expected = mat4.identity();
  const result = mat4.identity();

  beforeEach(() => {
    camera = new OrthographicCamera();
    mat4.identity(expected);
    mat4.identity(result);
  });

  it("should update projection, view and viewProjection when created", () => {
    camera.copyView(expected);
    expect(expected).toEqual(result);

    camera.copyProjection(expected);
    mat4.ortho(left, right, bottom, top, near, far, result);
    expect(expected).toEqual(result);

    camera.copyViewProjection(expected);
    expect(mat4.equalsApproximately(expected, result)).toBeTruthy();
  });

  it("should update projection when left is updated", () => {
    camera.left = -1;
    camera.copyProjection(expected);
    mat4.ortho(camera.left, right, bottom, top, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when right is updated", () => {
    camera.right = 1;
    camera.copyProjection(expected);
    mat4.ortho(left, camera.right, bottom, top, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when bottom is updated", () => {
    camera.bottom = -1;
    camera.copyProjection(expected);
    mat4.ortho(left, right, camera.bottom, top, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when top is updated", () => {
    camera.top = 1;
    camera.copyProjection(expected);
    mat4.ortho(left, right, bottom, camera.top, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when near is updated", () => {
    camera.near = 1;
    camera.copyProjection(expected);
    mat4.ortho(left, right, bottom, top, camera.near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when far is updated", () => {
    camera.far = 100;
    camera.copyProjection(expected);
    mat4.ortho(left, right, bottom, top, near, camera.far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when all properties are updated with default values", () => {
    camera.set();
    camera.copyProjection(expected);
    mat4.ortho(left, right, bottom, top, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when all properties are updated", () => {
    camera.set({ left: -1, right: 1, bottom: -1, top: 1, near: 1, far: 100 });
    camera.copyProjection(expected);
    // prettier-ignore
    mat4.ortho(camera.left, camera.right, camera.bottom, camera.top, camera.near, camera.far, result);
    expect(expected).toEqual(result);
  });
});
