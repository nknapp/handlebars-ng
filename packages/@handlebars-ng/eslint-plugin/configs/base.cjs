module.exports = {
  $schema: "https://json.schemastore.org/eslintrc",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "vitest"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: {
    es2022: true,
    "shared-node-browser": true,
  },
  rules: {
    "no-unused": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "[iI]gnored" },
    ],
    eqeqeq: ["error", "smart"],
    "no-console": ["error"],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          { group: ["src/*", "@/*"], message: "Use relative import instead" },
        ],
      },
    ],
    "vitest/no-focused-tests": "error",
    "vitest/no-disabled-tests": "error",
  },
  overrides: [
    {
      files: ["scripts/**/*"],
      rules: { "no-console": "off" },
      env: { node: true },
    },
    {
      files: ["*.cjs"],
      parserOptions: {
        sourceType: "script",
      },
      env: { commonjs: true },
    },
    {
      // Additional file types to be checked
      files: ["*.mjs", "*.d.ts"],
    },
  ],
};
