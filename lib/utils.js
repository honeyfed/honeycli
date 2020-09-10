const fs = require('fs')
function makeGithubUrlForTbTemplate(templateName) {
  return `https://github.com/tb-fed/template-${templateName}.git`
}

function loadJson(filePath) {
  const json = fs.readFileSync(filePath, 'utf-8')

  try {
    const jsonData = JSON.parse(json)
    return jsonData
  } catch (err) {
    console.log(err)
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