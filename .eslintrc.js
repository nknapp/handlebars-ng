const sourcesTs = ["packages/*/*/src/**/*.ts"];
const tests = ["packages/*/*/src/**/*.test.ts"];
const configTs = ["packages/*/*/vite.config.ts"];
const configJs = [".eslintrc.js"];

module.exports = {
  root: true,
  parserOptions: {
    sourceType: "script",
    ecmaVersion: 2021,
  },
  extends: ["eslint:recommended", "prettier"],
  rules: {
    eqeqeq: ["error", "always", { null: "ignore" }],
    "no-console": "error",
  },
  overrides: [
    {
      files: sourcesTs,
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
    },
    {
      files: tests,
      env: { jest: true },
    },
    {
      files: configJs,
      env: {
        node: true,
      },
    },
    {
      files: configTs,
      parser: "@typescript-eslint/parser",
      env: {
        node: true,
      },
    },
  ],
};
