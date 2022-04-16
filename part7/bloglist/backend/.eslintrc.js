module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    eqeqeq: "error",
    "no-console": "off",
    "no-unused-vars": "off",
  },
};
