const path = require("path");

module.exports = {
  env: {
    browser: true,
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2017,
    sourceType: "module",
  },
  extends: [
    "plugin:vue/essential",
    "plugin:react/recommended",
    path.resolve(__dirname, "../3rd/eslint-config-tencent"),
    "prettier",
    "prettier/react",
    "prettier/vue",
  ],
  plugins: ["vue", "react"],
};
