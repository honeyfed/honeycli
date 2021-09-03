const path = require("path");
const {getPathInLib}=require('../dir')
function getEslintrc(type = 0 ) {
  // type === 0 是vue项目 type === 1 为react项目
  if(type === 0){
    return `module.exports = {
  env: {
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['plugin:vue/essential', 'eslint-config-tencent'],
  plugins: ['vue', 'react'],
};`;
  } else {
    return `module.exports = {
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['plugin:react/recommended', 'eslint-config-tencent'],
  plugins: ['vue', 'react'],
};`;
  }

}

function getEsLintOptions() {
  return {
    fix: true,
    extensions: [".js", ".jsx", ".vue"],
    useEslintrc: false,
    errorOnUnmatchedPattern: false,
    overrideConfigFile: getPathInLib("./config/eslintrc.js"),
  };
}

module.exports = {
  getEslintrc,
  getEsLintOptions,
};
