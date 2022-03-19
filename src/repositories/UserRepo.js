const User = require('../models/User')

const insert = async (userData) => {
  try {
    const user = new User(userData)
    await user.save()
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const insertMany = async (users) => {
  try {
    return await User.insertMany(users)
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
    return await User.findById(id)
  } catch (error) {
    throw new Error(Error)
  }
}

const findOne = async (cond) => {
  try {
    return await User.findOne(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findMany = async(cond)=> {
  try {
    return await User.find(cond)
  } catch (error) {
    throw new Error(error)
  }
}

const findAll = async () => {
  try {
    return await User.find()
  } catch (error) {
    throw new Error(error)
  }
}

const updateById = async (id, data) => {
  try {
    return await User.findByIdAndUpdate(id, data, { new: true })
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  insert,
  insertMany,
  save,
  findById,
  findMany,
  findOne,
  findAll,
  updateById,
}
