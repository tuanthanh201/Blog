const { DataSource } = require('apollo-datasource')

const { uploadBase64Image, getCloudFrontUrl } = require('../S3')

class ImageService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async insertImage(image) {
    try {
      const { Key } = await uploadBase64Image(image)
      const imageContent = {
        key: Key,
        url: getCloudFrontUrl(Key),
      }
      return await this.store.imageRepo.insert(imageContent)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = ImageService
