const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const { DataSource } = require('apollo-datasource')
const { UserInputError } = require('apollo-server')

const { checkAuth } = require('../utils')

class UserService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async findTagById(tagId) {
    try {
      return await this.store.tagRepo.findById(tagId)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findTagsById(tagIds) {
    try {
      const tags = tagIds.map(async (tagId) => {
        return await this.store.tagRepo.findById(tagId)
      })
      return await tags
    } catch (error) {
      throw new Error(error)
    }
  }

  async findTagsByContent({ content }) {
    try {
      if (content === undefined || content.trim() === '') {
        throw new UserInputError('Tag must not be empty')
      }

      return await this.store.tagRepo.findMany({
        content: { $regex: `${content}`, $options: 'i' },
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllTags() {
    try {
      return await this.store.tagRepo.findAll()
    } catch (error) {
      throw new Error(error)
    }
  }

  async createTag({ content }) {
    try {
      // TODO: uncomment this
      // const user = await checkAuth(this.context.req, this.store.userRepo)

      if (content === undefined || content.trim() === '') {
        throw new UserInputError('Tag must not be empty')
      }

      // check if tag already exists
      const tagExists = !!(await this.store.tagRepo.findOne({
        content: { $regex: `${content}`, $options: 'i' },
      }))

      if (tagExists) {
        throw new UserInputError('Tag already exists')
      }

      const newTag = {
        content,
      }
      return await this.store.tagRepo.insert(newTag)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = UserService
