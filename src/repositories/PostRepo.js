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

const findManyAndSort = async (findOptions, sortOptions) => {
  try {
    return await Post.find(findOptions).sort(sortOptions)
  } catch (error) {
    throw new Error(error)
  }
}

const findAndSortByAggrField = async (aggregations, sortOptions) => {
  try {
    return await Post.aggregate(aggregations).sort(sortOptions)
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

const populate = async (post, query) => {
  try {
    return await user.populate(query).execPopulate()
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  insert,
  insertMany,
  save,
  findById,
  findOne,
  findMany,
  findManyAndSort,
  findAll,
  updateById,
  deleteById,
  populate,
  findAndSortByAggrField,
}
