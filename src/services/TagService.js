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

  async findTagsByTagObjs(tags) {
    try {
      const tagsFound = []
      for (const tag of tags) {
        const tagFound = await this.store.tagRepo.findById(tag.tagId)
        tagsFound.push(tagFound)
      }
      return tagsFound
    } catch (error) {
      throw new Error(error)
    }
  }

  async findTagsByContent(content) {
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

  async findTagByContentExact(content) {
    try {
      if (content === undefined || content.trim() === '') {
        throw new UserInputError('Tag must not be empty')
      }
      return await this.store.tagRepo.findOne({ content })
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
}

module.exports = UserService
