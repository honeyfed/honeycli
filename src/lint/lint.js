const path = require('path');
const { getPathInLib } = require('../dir');
const { writeFile } = require('../util/utils');

const { vueConfig, reactConfig } = require('./template');

function getEslintrc(type = 0) {
  // type === 0 是vue项目 type === 1 为react项目
  if (type === 0) {
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
  extends: ['plugin:vue/essential', 'eslint-config-tencent', 'eslint-config-tencent/prettier'],
  plugins: ['vue', 'react', 'prettier'],
  rules: {
    indent: ['off'],
  },
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
  extends: ['plugin:react/recommended', 'eslint-config-tencent', 'eslint-config-tencent/prettier'],
  plugins: ['vue', 'react', 'prettier'],
    rules: {
    indent: ['off'],
  },
};`;
  }
}

function getEslintConfig(type) {
  switch (type) {
    case 'react':
      return reactConfig;
    case 'vue':
    // vue 与 default 合并处理
    default:
      return vueConfig;
  }
}

function getEsLintOptions(isReact = false) {
  const configPath = path.resolve(process.cwd(), '.eslint.honey.js');
  const type = isReact ? 'react' : 'vue';
  const configObj = getEslintConfig(type);
  configObj['extends'] = getInternalEslintExtendPath(configObj);
  writeFile(configPath, `module.exports = ` + JSON.stringify(configObj));

  return {
    fix: true,
    extensions: ['.js', '.jsx', '.vue'],
    useEslintrc: false,
    // errorOnUnmatchedPattern: false,
    overrideConfigFile: configPath,
    resolvePluginsRelativeTo: process.cwd(), // 设置 plugin 目录相对地址，否则会取到当前 cli 目录
  };
}

// 将 webpack 运行时的 eslint 中 extends 字段文件加入项目中的绝对路径
function getInternalEslintExtendPath(eslintConfig) {
  if (Array.isArray(eslintConfig['extends'])) {
    return eslintConfig['extends'].map((item, index) =>
      /^plugin:/.test(String(item)) ? item : path.resolve(process.cwd(), `./node_modules/${item}`)
    );
  }
  return [];
}

module.exports = {
  getEslintrc,
  getEslintConfig,
  getEsLintOptions,
};
