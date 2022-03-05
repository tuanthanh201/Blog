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

const findById = async (id) => {
  try {
    return await Tag.findById(id)
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

const findMany = async (cond) => {
  try {
    return await Tag.find(cond)
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
  insertMany,
  findById,
  findOne,
  findMany,
  findAll,
}
