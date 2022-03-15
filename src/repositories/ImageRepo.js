const Image = require('../models/Image')

const insert = async (imageProps) => {
  try {
    const image = new Image(imageProps)
    return await image.save()
  } catch (error) {
    throw new Error(error)
  }
}

const insertMany = async (images) => {
  try {
    return await Image.insertMany(images)
  } catch (error) {
    throw new Error(error)
  }
}

const findById = async (id) => {
  try {
    return await Image.findById(id)
  } catch (error) {
    throw new Error(error)
  }
}

const findOne = async (cond) => {
  try {
    return await Image.findOne(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findMany = async (cond) => {
  try {
    return await Image.find(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findAll = async () => {
  try {
    return await Image.find()
  } catch (error) {
    throw new Error(error)
  }
}

const deleteById = async (imageId) => {
  try {
    return await Image.findByIdAndDelete(imageId)
  } catch (error) {
    throw new Error(error)
  }
}

const deleteMany = async (cond) => {
  try {
    return await Image.deleteMany(cond)
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
  deleteById,
  deleteMany,
}
