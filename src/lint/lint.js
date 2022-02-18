const path = require('path');
const { writeFile, rm } = require('../util/utils');
const { vueConfig, reactConfig } = require('./template');

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
    return eslintConfig['extends'].map((item) =>
      /^plugin:/.test(String(item)) ? item : path.resolve(process.cwd(), `./node_modules/${item}`)
    );
  }
  return [];
}

module.exports = {
  getEslintConfig,
  getEsLintOptions,
};
