const { CdnUploader } = require("../util/cdn");
const { loadHoneyConfig } = require("../util/config");
const { getFiles } = require("../util/utils");
const print = require("../util/print");
const path = require("path");

function normalizePath(packageName, basePath, filePath) {
  return path.join(packageName, path.relative(basePath, filePath)).replaceAll('\\','/');
}
async function cdnCmd() {
  const uploader = new CdnUploader();
  if (!uploader.init()) {
    print.error("cos初始化失败");
    return;
  }

  const config = loadHoneyConfig();

  const dist = config.dist;

  let jsFiles = await getFiles(dist + "/js/**/*.js");

  let styleFiles = await getFiles(dist + "/style/**/*.css");

  let imageFiles = await getFiles(dist + "/imgs/**/*");

  let fontFiles = await getFiles(dist + "/fonts/**/*");

  jsFiles = jsFiles.map((file) => ({
    cdnPath: normalizePath(config.packageName, config.dist, file),
    filePath: file,
  }));
  styleFiles = styleFiles.map((file) => ({
    cdnPath: normalizePath(config.packageName, config.dist, file),
    filePath: file,
  }));
  imageFiles = imageFiles.map((file) => ({
    cdnPath: normalizePath(config.packageName, config.dist, file),
    filePath: file,
  }));
  fontFiles = fontFiles.map((file) => ({
    cdnPath: normalizePath(config.packageName, config.dist, file),
    filePath: file,
  }));

  jsFiles.forEach(async (file) => {
    try {
      await uploader.uploadFile(file.cdnPath, file.filePath);
      print.info(`已上传${file.filePath}`);
    } catch (err) {
      print.error(err);
      print.error(`${file.filePath}上传失败`);
    }
  });

  styleFiles.forEach(async (file) => {
    try {
      await uploader.uploadFile(file.cdnPath, file.filePath);
      print.info(`已上传${file.filePath}`);
    } catch (err) {
      print.error(err);
      print.error(`${file.filePath}上传失败`);
    }
  });

  imageFiles.forEach(async (file) => {
    try {
      await uploader.uploadFile(file.cdnPath, file.filePath);
      print.info(`已上传${file.filePath}`);
    } catch (err) {
      print.error(err);
      print.error(`${file.filePath}上传失败`);
    }
  });

  fontFiles.forEach(async (file) => {
    try {
      await uploader.uploadFile(file.cdnPath, file.filePath);
      print.info(`已上传${file.filePath}`);
    } catch (err) {
      print.error(err);
      print.error(`${file.filePath}上传失败`);
    }
  });

}

module.exports = {
  cdnCmd,
};
