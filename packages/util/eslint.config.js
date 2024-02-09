// @ts-check

import tseslint from "typescript-eslint";
import customConfig from "../../configuration/eslint.base.config.js";

export default tseslint.config(...customConfig(import.meta.dirname));
