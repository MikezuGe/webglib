import { mat4 } from "wgpu-matrix";

import {
  PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO as aspect,
  PERSPECTIVE_CAMERA_DEFAULT_FAR as far,
  PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG as fov,
  PERSPECTIVE_CAMERA_DEFAULT_NEAR as near,
} from "src/definitions";
import { degToRad } from "src/utils";

import { PerspectiveCamera } from "../PerspectiveCamera";

describe("Perspective camera", () => {
  let camera = new PerspectiveCamera();
  const expected = mat4.identity();
  const result = mat4.identity();
  const fovRad = degToRad(fov);

  beforeEach(() => {
    camera = new PerspectiveCamera();
    mat4.identity(expected);
    mat4.identity(result);
  });

  it("should update projection, view and viewProjection when created", () => {
    camera.copyView(expected);
    expect(expected).toEqual(result);

    camera.copyProjection(expected);
    mat4.perspective(fovRad, aspect, near, far, result);
    expect(expected).toEqual(result);

    camera.copyViewProjection(expected);
    expect(expected).toEqual(result);
  });

  it("should update projection when fieldOfView is updated", () => {
    camera.fieldOfView = 90;
    camera.copyProjection(expected);
    // prettier-ignore
    mat4.perspective(degToRad(camera.fieldOfView), aspect, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when fieldOfViewRad is updated", () => {
    camera.fieldOfViewRad = fovRad;
    camera.copyProjection(expected);
    mat4.perspective(camera.fieldOfViewRad, aspect, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when aspectRatio is updated", () => {
    camera.aspectRatio = 2;
    camera.copyProjection(expected);
    mat4.perspective(fovRad, camera.aspectRatio, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when near is updated", () => {
    camera.near = 1;
    camera.copyProjection(expected);
    mat4.perspective(fovRad, aspect, camera.near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when far is updated", () => {
    camera.far = 100;
    camera.copyProjection(expected);
    mat4.perspective(fovRad, aspect, near, camera.far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when all properties are updated with default values", () => {
    camera.set();
    camera.copyProjection(expected);
    mat4.perspective(fovRad, aspect, near, far, result);
    expect(expected).toEqual(result);
  });

  it("should update projection when all properties are updated", () => {
    // prettier-ignore
    camera.set({ aspectRatio: 2, fieldOfView: 90, near: 1, far: 100, });
    camera.copyProjection(expected);
    // prettier-ignore
    mat4.perspective(camera.fieldOfViewRad, camera.aspectRatio, camera.near, camera.far, result);
    expect(expected).toEqual(result);
  });
});
