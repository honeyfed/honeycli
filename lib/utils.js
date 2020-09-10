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

module.exports = {
  makeGithubUrlForTbTemplate,
  loadJson
}