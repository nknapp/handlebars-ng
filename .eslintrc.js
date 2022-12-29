const sourcesTypeScript = [
  "packages/@handlebars-ng/*/src/**/*.ts",
  "packages/@handlebars-ng/*/src/**/*.tsx",
  "packages/@handlebars-ng/**/*.d.ts",
];
const scriptsTypeScript = ["packages/@handlebars-ng/*/scripts/**/*.ts"];
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
const baseRulesTs = {
  "no-unused": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    { varsIgnorePattern: "[iI]gnored" },
  ],
};

const testsTypeScript = ["packages/*/*/src/**/*.test.ts"];
const nodeTypeScript = ["packages/*/*/vite.config.ts"];
const nodeJavaScript = [".eslintrc.js", "*.cjs"];
const nodeModuleJavaScript = ["*.mjs"];

module.exports = {
  root: true,
  parserOptions: {
    sourceType: "script",
  },
  env: {
    es2022: true,
  },
  extends: ["eslint:recommended", "prettier"],
  rules: {
    eqeqeq: ["error", "always", { null: "ignore" }],
    "no-console": "error",
  },
  overrides: [
    {
      files: sourcesTypeScript,
      ...baseConfigTs,
      rules: baseRulesTs,
    },
    {
      files: scriptsTypeScript,
      ...baseConfigTs,
      rules: { ...baseRulesTs, ...scriptsRules },
    },
    {
      files: testsTypeScript,
      env: { jest: true },
    },
    {
      files: nodeJavaScript,
      env: {
        node: true,
      },
    },
    {
      files: nodeTypeScript,
      parser: "@typescript-eslint/parser",
      env: {
        node: true,
      },
    },
    {
      files: nodeModuleJavaScript,
      parserOptions: {
        sourceType: "module",
      },
      env: {
        node: true,
      },
    },
  ],
};
