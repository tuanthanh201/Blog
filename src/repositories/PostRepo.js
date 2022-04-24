const Post = require('../models/Post')

const insert = async (postData) => {
  try {
    const post = new Post(postData)
    return await post.save()
  } catch (error) {
    throw new Error(error)
  }
}

const save = async (post) => {
  try {
    return await post.save()
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

const findMany = async (cond) => {
  try {
    return await Post.find(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findManyAndSort = async (
  findOptions = {},
  sortOptions = {},
  limitOptions = 0
) => {
  try {
    return await Post.find(findOptions).sort(sortOptions).limit(limitOptions)
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
  save,
  findById,
  findMany,
  findManyAndSort,
  deleteById,
}
