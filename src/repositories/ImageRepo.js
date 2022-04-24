const Image = require('../models/Image')

const insert = async (imageProps) => {
  try {
    const image = new Image(imageProps)
    return await image.save()
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  insert,
}
