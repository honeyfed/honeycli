const { readFile, writeFile } = require("./utils");

function renderInPlaceSync(filepath, renderOptions) {
  let content = readFile(filepath);

  Object.keys(renderOptions).forEach((key) => {
    content = content.replaceAll(
      new RegExp(`{{{${key}}}}`, "gi"),
      renderOptions[key]
    );
  });

  writeFile(filepath, content);
}

module.exports = {
  renderInPlaceSync,
};
