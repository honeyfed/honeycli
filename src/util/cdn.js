const COS = require("cos-nodejs-sdk-v5");
const print = require("./print");
const fs = require('fs')
class CdnUploader {
  constructor() {}
  init() {
    if (!process.env.cdnId || !process.env.cdnKey) {
      print.error("请在环境变量中设置cdnId及cdnKey");
      this.cos = null;
      return false;
    }
    this.cos = new COS({
      SecretId: process.env.cdnId,
      SecretKey: process.env.cdnKey,
    });
    return true;
  }
  uploadFile(fileName, filePath) {
    // make filename

    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: "static-1258919571",
          Region: "ap-guangzhou",
          Key: `honeyfed/${fileName}`,
          Body: fs.readFileSync(filePath),
        },
        function(err, data) {
          if (err) {
            print.error(err);
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
}

module.exports = {
  CdnUploader,
};
