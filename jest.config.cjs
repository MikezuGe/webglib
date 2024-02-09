/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig.json");

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**/*.ts",
    "!./src/**/*.d.ts",
    "!./src/*.ts",
    // No testing for renderer, until test environment supports WebGPU
    "!./src/Renderer/**/*.ts",
    // No testing for initWebGPU, until test environment supports WebGPU
    "!./src/CustomCanvas/initWebGPU.ts",
    "!./src/**/index.ts",
  ],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    "^url:.*?$": "../../tests/mocks/assets.json",
  },
  preset: "ts-jest",
  setupFiles: ["<rootDir>/tests/setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/src/**/*.test.ts"],
  transform: {
    ".*\\.(ts|js)$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(wgpu-matrix)/)"],
  verbose: true,
};
