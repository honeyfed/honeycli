const path=require('path')

function getPathInLib(relativePath) {
  return path.resolve(__dirname, '../' ,relativePath)
}

module.exports = {
  getPathInLib
}