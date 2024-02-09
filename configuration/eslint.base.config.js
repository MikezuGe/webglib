// @ts-check

import tseslint from "typescript-eslint";
import { TSESLint } from "@typescript-eslint/utils";
import { reconfiguredRules } from "./tsconfigReconfiguredRules.js";

/**
 * @param {string} tsconfigRootDir
 * Use import.meta.dirname
 * @returns {TSESLint.FlatConfig.ConfigArray}
 */
const customConfig = (tsconfigRootDir) => [
  ...tseslint.configs.all,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir,
      },
    },
    rules: reconfiguredRules,
  },
  {
    ignores: ["dist", "eslint.config.js"],
  },
];

export default customConfig;
