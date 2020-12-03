const { makeGithubUrlForTbTemplate, isValidName, rm } = require("../util/utils")
const { gitClone } = require("../git/git")
const {GitError} = require('../util/errors')
const inquirer = require('inquirer')
const { loadTemplates } = require("../config")
const print = require('../util/print')

async function newCmd(templateName) {
  
  try {
    const templates = await loadTemplates()

    if (!templates) {
      throw new Error('no templates found')
    }
    // ask project name
    const options = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'project name',
        validate: value => {
          if (!value) {
            return 'project name should not be empty'
          }
          if (!isValidName(value)) {
            return 'invalid project name(only alphabet number _ - were allowed)'
          }
          return true
        }
      },
      {
        type: 'list',
        name: 'template',
        message: 'choose template',
        choices: () => {
          return templates.map(template => ({
            name: `${template.name} (${template.description}) - ${template.valid?'valid':'invalid'}`,
            value: template
          }))
        }
      }
    ])
    
    if (options.template.valid) {
      const githubUrl = makeGithubUrlForTbTemplate(options.template.name)
      await gitClone(githubUrl, options.projectName)
      await rm(options.projectName+'/.git')
    } else {
      throw new Error('invalid template: '+options.template.name)
    }
    
  } catch(err) {
    if (err instanceof GitError) {
      print.error(err.message)
    } else {
      print.error(err)
    }
  }
  
}

module.exports = {
  newCmd
}