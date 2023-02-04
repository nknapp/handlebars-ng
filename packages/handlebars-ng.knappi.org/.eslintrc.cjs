module.exports = {
  root: true,
  plugins: ["@handlebars-ng/eslint-plugin"],
  extends: ["plugin:@handlebars-ng/base"],
  rules: {
    "no-restricted-imports": "off",
  },
};
