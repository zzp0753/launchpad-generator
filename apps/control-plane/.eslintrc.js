module.exports = {
  extends: ["../../.eslintrc.js"],
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  env: {
    node: true,
  },
  rules: {
    "@typescript-eslint/no-empty-function": "off",
  },
  ignorePatterns: ["dist"],
};
