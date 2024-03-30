import { assertExists, getBytesFromFormat, getSizeFromFormat } from "../src";

describe("util", () => {
  const zero = 0;
  const one = 1;
  const two = 2;
  const three = 3;
  const four = 4;
  const eight = 8;
  const sixteen = 16;
  const thirtyTwo = 32;

  describe("assertExists", () => {
    it("throws an error if value is null", () => {
      expect(() => assertExists(null)).toThrow("Expected value to exist");
    });

    it("throws an error if value is undefined", () => {
      expect(() => assertExists(undefined)).toThrow("Expected value to exist");
    });

    it("does not throw an error if value is not null or undefined", () => {
      expect(() => assertExists(zero)).not.toThrow();
      expect(() => assertExists("")).not.toThrow();
      expect(() => assertExists(false)).not.toThrow();
    });

    it("throws an error with a custom message", () => {
      expect(() => assertExists(null, "Custom message")).toThrow(
        "Custom message"
      );
    });
  });

  describe("getBytesFromFromat", () => {
    it("returns 1 for formats without a number", () => {
      // @ts-expect-error - Testing invalid input
      expect(getBytesFromFormat("float")).toBe(one);
    });

    it("returns 8, 16 or 32 for valid formats", () => {
      expect(getBytesFromFormat("float16x2")).toBe(sixteen);
      expect(getBytesFromFormat("float32")).toBe(thirtyTwo);
      expect(getBytesFromFormat("uint8x4")).toBe(eight);
    });
  });

  describe("getSizeFromFormat", () => {
    it("returns 1 for formats without a number", () => {
      // @ts-expect-error - Testing invalid input
      expect(getSizeFromFormat("float")).toBe(one);
    });

    it("returns the number after the x", () => {
      expect(getSizeFromFormat("float16x2")).toBe(two);
      expect(getSizeFromFormat("uint8x4")).toBe(four);
      expect(getSizeFromFormat("sint32x3")).toBe(three);
    });
  });
});
