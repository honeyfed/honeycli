const path = require("path");

module.exports = {
  env: {
    browser: true,
  },
  extends: [
    "plugin:vue/essential",
    "plugin:react/recommended",
    path.resolve(__dirname, "../3rd/eslint-config-tencent"),
    "prettier",
    "prettier/react",
    "prettier/vue",
  ],
  plugins: ["vue","react"],
};
