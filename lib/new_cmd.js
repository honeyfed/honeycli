const { makeGithubUrlForTbTemplate } = require("./utils")
const { gitClone } = require("./git")

function newCmd(templateName) {
  const githubUrl = makeGithubUrlForTbTemplate(templateName)
  gitClone(githubUrl, templateName)
}

module.exports = {
  newCmd
}