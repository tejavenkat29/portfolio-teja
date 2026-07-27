import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Build output (any dist dir) and Next's generated ambient types.
    ignores: [".next/**", ".next-*/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
