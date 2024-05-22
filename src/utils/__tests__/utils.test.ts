/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  assertExists,
  defaultMessage as assertExistsDefaultMessage,
} from "../assertExists";
import { calculateSurfaceNormal } from "../calculateSurfaceNormal";
import { degToRad } from "../degToRad";
import { radToDeg } from "../radToDeg";

describe("utils", () => {
  describe("assertExists", () => {
    it("passes with non null and undefined values", () => {
      expect(() => assertExists(1)).not.toThrow(assertExistsDefaultMessage);
      expect(() => assertExists("1")).not.toThrow(assertExistsDefaultMessage);
      expect(() => assertExists(0)).not.toThrow(assertExistsDefaultMessage);
      expect(() => assertExists("")).not.toThrow(assertExistsDefaultMessage);
      expect(() => assertExists({})).not.toThrow(assertExistsDefaultMessage);
      expect(() => assertExists([])).not.toThrow(assertExistsDefaultMessage);
      expect(() => assertExists(true)).not.toThrow(assertExistsDefaultMessage);
      expect(() => assertExists(false)).not.toThrow(assertExistsDefaultMessage);
    });

    it("throws with null and undefined", () => {
      expect(() => assertExists(null)).toThrow(assertExistsDefaultMessage);
      expect(() => assertExists(undefined)).toThrow(assertExistsDefaultMessage);
    });

    it("throws with custom message", () => {
      const customMessage = "Custom message";
      expect(() => assertExists(null, customMessage)).toThrow(customMessage);
    });
  });

  describe("calculateSurfaceNormal", () => {
    it("calculates surface normal", () => {
      const expected = [0, 0, 0];
      const result = [0, 0, 1];
      const v1 = [0, 0, 0];
      const v2 = [1, 0, 0];
      const v3 = [0, 1, 0];
      calculateSurfaceNormal(v1, v2, v3, expected);
      expect(expected).toEqual(result);
    });
  });

  describe("degToRad", () => {
    it("converts degrees to radians", () => {
      expect(degToRad(180)).toBe(Math.PI);
      expect(degToRad(90)).toBe(Math.PI / 2);
      expect(degToRad(45)).toBe(Math.PI / 4);
    });
  });

  describe("radToDeg", () => {
    it("converts radians to degrees", () => {
      expect(radToDeg(Math.PI)).toBe(180);
      expect(radToDeg(Math.PI / 2)).toBe(90);
      expect(radToDeg(Math.PI / 4)).toBe(45);
    });
  });
});
