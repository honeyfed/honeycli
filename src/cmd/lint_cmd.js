const { ESLint } = require("eslint");
const { getEsLintOptions } = require("../lint/lint");
const { loadHoneyConfig } = require("../util/config");
async function lintCmd() {
  const config = loadHoneyConfig();
  const eslint = new ESLint(getEsLintOptions());
  const results = await eslint.lintFiles([config.src + "/**/*.vue", config.src + "/**/*.js"]);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  console.log(resultText);
}

module.exports = {
  lintCmd,
};
