module.exports = {
  root: true,
  plugins: ["@handlebars-ng/eslint-plugin", "solid"],
  extends: ["plugin:@handlebars-ng/base", "plugin:solid/typescript"],
  env: {
    node: true,
  },
};
