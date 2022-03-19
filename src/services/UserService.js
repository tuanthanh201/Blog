const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const { DataSource } = require('apollo-datasource')
const { AuthenticationError, UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const { withFilter } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')

const { checkAuth, validateUserInput } = require('../utils')

class UserService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  generateToken(user) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JSON_SECRET
    )
    return token
  }

  async findUserById(userId) {
    try {
      return await this.store.userRepo.findById(userId)
    } catch (error) {
      throw new Error(error)
    }
  }

  async FindUsersByIds(userIds) {
    try {
      return await this.store.userRepo.findMany({ _id: { $in: userIds } })
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllUsers() {
    try {
      return await this.store.userRepo.findAll()
    } catch (error) {
      throw new Error(error)
    }
  }

  async getMe() {
    try {
      const parsedToken = this.context.req.parsedToken
      if (!parsedToken) {
        return null
      }
      return await this.store.userRepo.findById(parsedToken.id)
    } catch (error) {
      throw new Error(error)
    }
  }

  async register({ registerInput }) {
    try {
      validateUserInput(registerInput)
      let { username, email, password } = registerInput

      // check email
      const emailExisted = !!(await this.store.userRepo.findOne({ email }))
      if (emailExisted) {
        throw new UserInputError(
          'An account associated with this email already exists'
        )
      }

      // check username
      const usernameExisted = !!(await this.store.userRepo.findOne({
        username,
      }))
      if (usernameExisted) {
        throw new UserInputError('Username already exists')
      }

      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)
      const newUser = await this.store.userRepo.insert({
        ...registerInput,
        username,
        email,
        password,
      })
      const token = this.generateToken(newUser)
      this.context.res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 3,
        httpOnly: false,
      })
      return newUser
    } catch (error) {
      throw new Error(error)
    }
  }

  async login({ loginInput }) {
    try {
      validateUserInput(loginInput)
      const { email, password } = loginInput

      // check if user exists
      const user = await this.store.userRepo.findOne({ email })
      if (!user) {
        throw new AuthenticationError('Invalid credentials')
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
        throw new AuthenticationError('Invalid credentials')
      }

      const token = this.generateToken(user)
      this.context.res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 3,
        httpOnly: false,
      })
      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  async logout() {
    this.context.res.cookie('token', '', {
      httpOnly: false,
      expires: new Date(0),
    })
  }

  async updateBio(args) {
    try {
      const { userId, bio } = args
      const user = await checkAuth(this.context.req, this.store.userRepo)

      if (user._id.toString() !== userId) {
        throw new AuthenticationError('You are not allowed to edit this bio')
      }

      return await this.store.userRepo.updateById(userId, { bio })
    } catch (error) {
      throw new Error(error)
    }
  }

  async subscribe(userId) {
    try {
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const author = await this.store.userRepo.findById(userId)

      if (!author) {
        throw new Error('Author does not exist')
      }

      // check if already subscribed to author
      if (
        author.subscribers.some(
          (subscriber) => subscriber._id.toString() === user._id.toString()
        )
      ) {
        author.subscribers = author.subscribers.filter(
          (subscribe) => subscribe._id.toString() !== user._id.toString()
        )
      } else {
        author.subscribers.push(user._id)
      }
      return await this.store.userRepo.save(author)
    } catch (error) {
      throw new Error(error)
    }
  }

  async newNotification(context) {
    return context.pubsub.asyncIterator('NEW_NOTIFICATION')
  }
}

module.exports = UserService
