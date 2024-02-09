import { mat4 } from "wgpu-matrix";

import {
  PERSPECTIVE_CAMERA_DEFAULT_ASPECT_RATIO as aspect,
  PERSPECTIVE_CAMERA_MIN_ASPECT_RATIO as aspectMin,
  PERSPECTIVE_CAMERA_DEFAULT_FAR as far,
  PERSPECTIVE_CAMERA_MIN_FAR as farMin,
  PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_DEG as fovdDefault,
  PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_DEG as fovdMax,
  PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_DEG as fovdMin,
  PERSPECTIVE_CAMERA_DEFAULT_FIELD_OF_VIEW_RAD as fovrDefault,
  PERSPECTIVE_CAMERA_MAX_FIELD_OF_VIEW_RAD as fovrMax,
  PERSPECTIVE_CAMERA_MIN_FIELD_OF_VIEW_RAD as fovrMin,
  PERSPECTIVE_CAMERA_DEFAULT_NEAR as near,
  PERSPECTIVE_CAMERA_MIN_NEAR as nearMin,
} from "/src/definitions";

import { PerspectiveCamera } from "../PerspectiveCamera";

describe("Perspective camera", () => {
  let camera = new PerspectiveCamera();
  const expected = mat4.identity();
  const result = mat4.identity();

  const aspectNew = 2;
  const fovdNew = 90;
  const fovrNew = 1.5707963267948966;
  const nearNew = 1;
  const farNew = 50;

  beforeEach(() => {
    camera = new PerspectiveCamera();
    mat4.identity(expected);
    mat4.identity(result);
  });

  it("should update view, projection and viewProjection when created", () => {
    camera.copyView(expected);
    expect(expected).toEqual(result);

    camera.copyProjection(expected);
    mat4.perspective(fovrDefault, aspect, near, far, result);
    expect(expected).toEqual(result);

    camera.copyViewProjection(expected);
    expect(expected).toEqual(result);
  });

  it("should update aspect ratio", () => {
    camera.aspectRatio = aspectNew;
    expect(camera.aspectRatio).toBe(aspectNew);
  });

  it("should update field of view in degrees", () => {
    camera.fieldOfViewDeg = fovdNew;
    expect(camera.fieldOfViewDeg).toBe(fovdNew);
    expect(camera.fieldOfViewRad).toBe(fovrNew);
  });

  it("should update field of view in radians", () => {
    camera.fieldOfViewRad = fovrNew;
    expect(camera.fieldOfViewDeg).toBe(fovdNew);
    expect(camera.fieldOfViewRad).toBe(fovrNew);
  });

  it("should update near", () => {
    camera.near = nearNew;
    expect(camera.near).toBe(nearNew);
  });

  it("should update far", () => {
    camera.far = farNew;
    expect(camera.far).toBe(farNew);
  });

  it("should set any or all properties of the perspective camera", () => {
    camera.set({
      aspectRatio: aspectNew,
      fieldOfViewDeg: fovdNew,
      near: nearNew,
      far: farNew,
    });
    expect(camera.aspectRatio).toBe(aspectNew);
    expect(camera.fieldOfViewDeg).toBe(fovdNew);
    expect(camera.fieldOfViewRad).toBe(fovrNew);
    expect(camera.near).toBe(nearNew);
    expect(camera.far).toBe(farNew);
    camera.set({
      fieldOfViewRad: fovrDefault,
    });
    expect(camera.fieldOfViewDeg).toBeCloseTo(fovdDefault);
    expect(camera.fieldOfViewRad).toBe(fovrDefault);
  });

  it("should not update aspect ratio if it is the same", () => {
    // @ts-expect-error - _setDirty is private
    const setDirty = jest.spyOn(camera, "_setDirty");
    camera.aspectRatio = aspect;
    expect(setDirty).not.toHaveBeenCalled();
  });

  it("should not update field of view in degrees if it is the same", () => {
    // @ts-expect-error - _setDirty is private
    const setDirty = jest.spyOn(camera, "_setDirty");
    camera.fieldOfViewDeg = fovdDefault;
    expect(setDirty).not.toHaveBeenCalled();
  });

  it("should not update field of view in radians if it is the same", () => {
    // @ts-expect-error - _setDirty is private
    const setDirty = jest.spyOn(camera, "_setDirty");
    camera.fieldOfViewRad = fovrDefault;
    expect(setDirty).not.toHaveBeenCalled();
  });

  it("should not update near if it is the same", () => {
    // @ts-expect-error - _setDirty is private
    const setDirty = jest.spyOn(camera, "_setDirty");
    camera.near = near;
    expect(setDirty).not.toHaveBeenCalled();
  });

  it("should not update far if it is the same", () => {
    // @ts-expect-error - _setDirty is private
    const setDirty = jest.spyOn(camera, "_setDirty");
    camera.far = far;
    expect(setDirty).not.toHaveBeenCalled();
  });

  it("should not set any properties if none are provided", () => {
    // @ts-expect-error - _setDirty is private
    const setDirty = jest.spyOn(camera, "_setDirty");
    camera.set({});
    expect(setDirty).not.toHaveBeenCalled();
  });

  it("should throw error if aspect ratio is less than minimum", () => {
    expect(() => {
      camera.aspectRatio = 0;
    }).toThrow(`Aspect ratio must be greater than ${aspectMin}`);
  });

  it("should throw error if field of view in degrees is less than minimum", () => {
    expect(() => {
      camera.fieldOfViewDeg = 0;
    }).toThrow(`Field of view must be greater than ${fovdMin}`);
  });

  it("should throw error if field of view in degrees is greater than maximum", () => {
    expect(() => {
      camera.fieldOfViewDeg = 181;
    }).toThrow(`Field of view must be less than ${fovdMax}`);
  });

  it("should throw error if field of view in radians is less than minimum", () => {
    expect(() => {
      camera.fieldOfViewRad = 0;
    }).toThrow(`Field of view must be greater than ${fovrMin}`);
  });

  it("should throw error if field of view in radians is greater than maximum", () => {
    expect(() => {
      camera.fieldOfViewRad = 7;
    }).toThrow(`Field of view must be less than ${fovrMax}`);
  });

  it("should throw error if near is less than minimum", () => {
    expect(() => {
      camera.near = 0;
    }).toThrow(`Near must be greater than ${nearMin}`);
  });

  it("should throw error if far is less than minimum", () => {
    expect(() => {
      camera.far = 0;
    }).toThrow(`Far must be greater than ${farMin}`);
  });

  it("should throw error if near is greater or equal to far", () => {
    expect(() => {
      camera.near = 100;
    }).toThrow("Near must be less than far");
    expect(() => {
      camera.near = far;
    }).toThrow("Near must be less than far");
  });

  it("should throw error if far is less or equal to near", () => {
    camera.near = 1.0;
    expect(() => {
      camera.far = 0.1;
    }).toThrow("Far must be greater than near");
    expect(() => {
      camera.far = 1.0;
    }).toThrow("Far must be greater than near");
  });
});
