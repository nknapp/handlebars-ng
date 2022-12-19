const sourcesTs = [
  "packages/@handlebars-ng/*/src/**/*.ts",
  "packages/@handlebars-ng/**/*.d.ts",
];
const scriptsTs = ["packages/@handlebars-ng/*/scripts/**/*.ts"];
const baseConfigTs = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
};
const scriptsRules = { "no-console": "off" };

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
      ...baseConfigTs,
    },
    {
      files: scriptsTs,
      ...baseConfigTs,
      rules: scriptsRules,
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
