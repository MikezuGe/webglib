#!/bin/bash

root=$(pwd)
app_name=$1
app_path="apps/$app_name"
pkg_path="packages/$app_name"
app_name_new="@webglib/$app_name"

throw_if_exists() {
  if [ -d "$app_path" ]; then
    echo "App \"$app_name\" already exists. Exiting."
    exit 1
  fi

  if [ -d "$pkg_path" ]; then
    echo "Package \"$app_name\" already exists. Exiting."
    exit 1
  fi
}

setup_packagejson() {
  npm init -w "$app_path" -y >> /dev/null

  cd "$app_path"

  npm pkg delete >> /dev/null main

  npm pkg set >> /dev/null \
    name="$app_name_new" \
    type="module" \
    source="src/index.html" \
    scripts.test="jest" \
    scripts.start="parcel serve" \
    scripts.prebuild="rimraf dist" \
    scripts.build="parcel build" \
    scripts.lint="eslint ." \
    jest.preset="ts-jest" \
    jest.testEnvironment="jsdom" \
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
export const $app_name = (param?: boolean): boolean => {
  console.log("$app_name");
  return !!param;
};
EOF

  cat <<EOF >> index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$app_name</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="index.ts"></script>
  </body>
</html>
EOF

  cd ..
}

setup_tests() {
  mkdir __tests__
  cd __tests__

  cat <<EOF >> index.test.ts
import { $app_name } from "../src";

describe("$app_name", () => {
  it("returns true", () => {
    expect($app_name(true)).toBe(true);
  });

  it("returns false", () => {
    expect($app_name(false)).toBe(false);
  });

  it("returns false", () => {
    expect($app_name()).toBe(false);
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
    jest-environment-jsdom \
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
