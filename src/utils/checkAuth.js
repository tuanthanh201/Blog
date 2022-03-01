const { AuthenticationError } = require('apollo-server')

const checkAuth = async (req, userRepo) => {
  const parsedToken = req.parsedToken
  if (!parsedToken) {
    throw new AuthenticationError('Please login first')
  }
  const user = await userRepo.findById(parsedToken.id)
  if (!user) {
    throw new AuthenticationError('Cannot find user')
  }
  return user
}

module.exports = checkAuth
