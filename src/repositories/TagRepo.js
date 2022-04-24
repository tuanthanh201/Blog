const Tag = require('../models/Tag')

const insert = async (content) => {
  try {
    const tag = new Tag({ content })
    return await tag.save()
  } catch (error) {
    throw new Error(error)
  }
}

const findOne = async (cond) => {
  try {
    return await Tag.findOne(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findAll = async () => {
  try {
    return await Tag.find()
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  insert,
  findOne,
  findAll,
}
