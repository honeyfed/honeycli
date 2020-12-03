const path = require('path')
module.exports = {
  env: {
    browser: true,
  },
  extends: ["plugin:vue/essential", path.resolve(__dirname, '../../3rd/eslint-config-tencent')],
  plugins: ["vue"],
};
