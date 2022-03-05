const { UserInputError } = require('apollo-server')

const validatePostInput = (args) => {
  const { title, body } = args
  if (title === undefined || title.trim() === '') {
    throw new UserInputError('Title must not be empty')
  }

  if (body === undefined || body.trim() === '') {
    throw new UserInputError('Body must not be empty')
  }
}

module.exports = validatePostInput
