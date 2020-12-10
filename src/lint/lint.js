const path = require("path");
const {getPathInLib}=require('../dir')
function getEslintrc() {
  return `
  module.exports = {
    env: {
      browser: true,
    },
    extends: ["plugin:vue/essential", 'eslint-config-tencent'],
    plugins: ["vue"],
  };
  `;
}

function getEsLintOptions() {
  return {
    fix: true,
    extensions: [".js", ".jsx", ".vue"],
    useEslintrc: false,
    overrideConfigFile: getPathInLib("./config/eslintrc.js"),
  };
}

module.exports = {
  getEslintrc,
  getEsLintOptions,
};
