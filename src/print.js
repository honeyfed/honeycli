const chalk = require('chalk')

function info(message) {
  console.log(chalk.green(message))
}

function error(message) {
  console.log(chalk.red(message))
}

module.exports = {
  info,
  error
}