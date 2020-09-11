const fs = require('fs')
const print = require('./print')
function makeGithubUrlForTbTemplate(templateName) {
  return `https://github.com/tb-fed/template-${templateName}.git`
}

function loadJson(filePath) {
  const json = fs.readFileSync(filePath, 'utf-8')

  try {
    const jsonData = JSON.parse(json)
    return jsonData
  } catch (err) {
    print.error(err)
  }
  return null
}

function isValidName(name) {
  return /^[a-zA-Z0-9-_]+$/.test(name)
}



module.exports = {
  makeGithubUrlForTbTemplate,
  loadJson,
  isValidName
}