
function urlToRelatedDir(appPath) {
  if (appPath.slice(-1) !== '/') {
    appPath+='/'
  }
  if (appPath[0] === '/') {
    appPath = appPath.slice(1)
  }
  return './'+appPath
}

function fixUrlSuffix(url) {
  let urlfix = url
  if (urlfix.slice(-1)!=='/') {
    urlfix+='/'
  }
  return urlfix;
}

module.exports= {
  urlToRelatedDir,
  fixUrlSuffix
}