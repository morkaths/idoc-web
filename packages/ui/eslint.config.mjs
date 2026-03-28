import { dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "@repo/eslint-config/react-internal";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ["eslint.config.mjs", "postcss.config.cjs", "tailwind.config.cjs"],
  },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
  },
];
