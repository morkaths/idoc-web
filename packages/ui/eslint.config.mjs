import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};