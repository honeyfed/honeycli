class GitError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = {
  GitError
}