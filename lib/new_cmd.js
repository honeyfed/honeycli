const { makeGithubUrlForTbTemplate } = require("./utils")
const { gitClone } = require("./git")
const {GitError} = require('./errors')

async function newCmd(templateName) {
  const githubUrl = makeGithubUrlForTbTemplate(templateName)
  try {
    await gitClone(githubUrl, templateName)
  } catch(err) {
    if (err instanceof GitError) {
      console.log(err.message)
    }
  }
  
}

module.exports = {
  newCmd
}