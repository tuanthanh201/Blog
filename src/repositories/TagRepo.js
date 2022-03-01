const Tag = require('../models/Tag')

const insert = async (tagData) => {
  try {
    const tag = new Tag(tagData)
    return await tag.save()
  } catch (error) {
    throw new Error(error)
  }
}

const insertMany = async (tags) => {
  try {
    return await Tag.insertMany(tags)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  insert,
  insertMany,
}
