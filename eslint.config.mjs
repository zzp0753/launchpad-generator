import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";

const nextAppFiles = (patterns = []) =>
  patterns.length > 0
    ? patterns.map((pattern) => `apps/launchpad-web/${pattern}`)
    : ["apps/launchpad-web/**/*.{js,jsx,mjs,ts,tsx,mts,cts}"];

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.turbo/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "tailwind.config.js",
      "postcss.config.js",
      "apps/launchpad-web/tailwind.config.js",
      "apps/launchpad-web/postcss.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next.map((config) => ({
    ...config,
    files: nextAppFiles(config.files),
  })),
  {
    files: ["apps/control-plane/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-empty-function": "off",
    },
  },
];
