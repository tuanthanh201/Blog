const { UserInputError } = require('apollo-server')

const validateInput = (args) => {
  const { username, email, password } = args
  if (username !== undefined && username.trim() === '') {
    throw new UserInputError('Username must not be empty')
  }
  if (email !== undefined) {
    const validEmail = email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    if (!validEmail) {
      throw new UserInputError('Email must be a valid email')
    }
  }
  if (password !== undefined) {
    if (password.trim() === '') {
      throw new UserInputError('Password must not be empty')
    }
    if (password.length < 8) {
      throw new UserInputError('Password must contain at least 8 characters')
    }
  }
}

module.exports = validateInput
