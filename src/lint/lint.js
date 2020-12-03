
function getEslintrc() {
  return `
  module.exports = {
    env: {
      browser: true,
    },
    extends: ["plugin:vue/essential", 'eslint-config-tencent'],
    plugins: ["vue"],
  };
  `
}

module.exports = {
  getEslintrc
}