const { DataSource } = require('apollo-datasource')

class TagService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async findAllTags() {
    try {
      return await this.store.tagRepo.findAll()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = TagService
