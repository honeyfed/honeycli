const { loadHoneyConfig } = require("../util/config");
const { getFiles, readFile, writeFile } = require("../util/utils");
const print = require("../util/print");
const {getPrettierrc} = require('../format/rc')
const prettier = require("prettier");
const path = require("path");
async function formatCmd() {
  const config = loadHoneyConfig();
  let files = await getFiles(config.src + "/**/*.js");
  const vueFiles = await getFiles(config.src + "/**/*.vue");
  files = [...files, ...vueFiles];

  const prettierrc = getPrettierrc();
  files.forEach(async (filepath) => {
    print.info(`格式化 ${filepath}...`);
    const source = readFile(filepath);
    const ext = path.extname(filepath);
    prettierrc.parser = ext === ".vue" ? "vue" : "babel";
    const formattedSource = prettier.format(source, prettierrc);

    writeFile(filepath, (formattedSource || "").replaceAll('\r\n', '\n'));
  });
}

module.exports = {
  formatCmd,
};
