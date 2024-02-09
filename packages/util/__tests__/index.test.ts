import { assertExists } from "../src";

describe("util", () => {
  const zero = 0;

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
});
