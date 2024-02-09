/* eslint-disable @typescript-eslint/no-magic-numbers */
import { assertExists } from "src/utils";

describe("utils", () => {
  describe("assertExists", () => {
    it("passes with truthy values", () => {
      expect(() => assertExists(1, "No adapter found")).not.toThrow(
        "No adapter found"
      );
      expect(() => assertExists("1", "No adapter found")).not.toThrow(
        "No adapter found"
      );
      expect(() => assertExists({}, "No adapter found")).not.toThrow(
        "No adapter found"
      );
      expect(() => assertExists([], "No adapter found")).not.toThrow(
        "No adapter found"
      );
    });

    it("throws with null", () => {
      expect(() => assertExists(null, "No adapter found")).toThrow(
        "No adapter found"
      );
    });

    it("throws with undefined", () => {
      expect(() => assertExists(undefined, "No adapter found")).toThrow(
        "No adapter found"
      );
    });
  });
});
