const path=require("path");function getEslintrc(){return`
  module.exports = {
    env: {
      browser: true,
    },
    extends: ["plugin:vue/essential", 'eslint-config-tencent'],
    plugins: ["vue"],
  };
  `}function getEsLintOptions(){return{fix:!0,extensions:[".js",".jsx",".vue"],useEslintrc:!1,overrideConfigFile:path.resolve(__dirname,"./eslintrc.js")}}module.exports={getEslintrc,getEsLintOptions};