const chalk = require("chalk");

function info(message) {
  console.log(chalk.green(message));
}

function error(message) {
  if (typeof message === "object") {
    message = JSON.stringify(message);
  }
  console.log(chalk.red(message));
}

module.exports = {
  info,
  error,
};
