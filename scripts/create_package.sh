#!/bin/bash

root=$(pwd)
pkg_name=$1
pkg_path="packages/$pkg_name"
app_path="apps/$pkg_name"
pkg_name_new="@webglib/$pkg_name"

throw_if_exists() {
  if [ -d "$app_path" ]; then
    echo "App \"$pkg_name\" already exists. Exiting."
    exit 1
  fi

  if [ -d "$pkg_path" ]; then
    echo "Package \"$pkg_name\" already exists. Exiting."
    exit 1
  fi
}

setup_packagejson() {
  npm init -w "$pkg_path" -y >> /dev/null

  cd "$pkg_path"

  npm pkg delete >> /dev/null main

  npm pkg set >> /dev/null \
    name="$pkg_name_new" \
    type="module" \
    source="src/index.ts" \
    main="dist/index.js" \
    types="dist/index.d.ts" \
    scripts.test="jest" \
    scripts.start="parcel watch" \
    scripts.prebuild="rimraf dist" \
    scripts.build="parcel build" \
    scripts.lint="eslint ." \
    jest.preset="ts-jest" \
    jest.testEnvironment="node" \
    jest.testMatch[0]="**/__tests__/**/*.test.ts"
}

setup_tsconfig() {
  cat <<EOF >> tsconfig.json
{
  "extends": "../../tsconfig.json"
}
EOF
}

setup_src() {
  mkdir src
  cd src

  cat <<EOF >> index.ts
export const $pkg_name = (param?: boolean): boolean => {
  console.log("$pkg_name");
  return !!param;
};
EOF

  cd ..
}

setup_tests() {
  mkdir __tests__
  cd __tests__

  cat <<EOF >> index.test.ts
import { $pkg_name } from "../src";

describe("$pkg_name", () => {
  it("returns true", () => {
    expect($pkg_name(true)).toBe(true);
  });

  it("returns false", () => {
    expect($pkg_name(false)).toBe(false);
  });

  it("returns false", () => {
    expect($pkg_name()).toBe(false);
  });
});
EOF

  cd ..
}

setup_typescript_eslint() {
  cat <<EOF >> tsconfig.eslint.json
{
  "extends": "./tsconfig.json",
  "include": ["src", "__tests__"],
  "compilerOptions": {
    "noEmit": true
  }
}
EOF

  cat <<EOF >> eslint.config.js
// @ts-check

import tseslint from "typescript-eslint";
import customConfig from "../../configuration/eslint.base.config.js";

export default tseslint.config(...customConfig(import.meta.dirname));
EOF
}

npm_install() {
  npm install -D \
    @types/jest \
    eslint \
    jest \
    parcel \
    rimraf \
    ts-jest \
    typescript \
    typescript-eslint
}

throw_if_exists
setup_packagejson
setup_tsconfig
setup_src
setup_tests
setup_typescript_eslint
npm_install
