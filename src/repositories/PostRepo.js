const Post = require('../models/Post')

const insert = async (postData) => {
  try {
    const post = new Post(postData)
    return await post.save()
  } catch (error) {
    throw new Error(error)
  }
}

const insertMany = async (posts) => {
  try {
    return await Post.insertMany(posts)
  } catch (error) {
    throw new Error(error)
  }
}

const save = async (user) => {
  try {
    return await user.save()
  } catch (error) {
    throw new Error(error)
  }
}

const findById = async (id) => {
  try {
    return await Post.findById(id)
  } catch (error) {
    throw new Error(error)
  }
}

const findOne = async (cond) => {
  try {
    return await Post.findOne(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findMany = async (cond) => {
  try {
    return await Post.find(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findAll = async () => {
  try {
    return await Post.find()
  } catch (error) {
    throw new Error(error)
  }
}

const updateById = async (id, data) => {
  try {
    return await Post.findByIdAndUpdate(id, data, { new: true })
  } catch (error) {
    throw new Error(error)
  }
}

const deleteById = async (id) => {
  try {
    return await Post.findByIdAndDelete(id)
  } catch (error) {
    throw new Error(Error)
  }
}

module.exports = {
  insert,
  insertMany,
  save,
  findById,
  findOne,
  findMany,
  findAll,
  updateById,
  deleteById,
}
