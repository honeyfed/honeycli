const { generateBasicWebpackConfig } = require("./baseconfig");

function generateWebpackLibConfig(config) {
  const webpackConfig = generateBasicWebpackConfig(config, "production");

  webpackConfig.output = {
    path: config.dist,
    filename: `${config.libName}.min.js`,
    library: config.umdName,
    libraryTarget: "umd",
  };

  return webpackConfig;
}
module.exports = {
  generateWebpackLibConfig,
};
