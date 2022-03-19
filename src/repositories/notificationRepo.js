const Notification = require('../models/Notification')

const insert = async (notification) => {
  try {
    const noti = new Notification(notification)
    return await noti.save()
  } catch (error) {
    throw new Error(error)
  }
}

const findById = async (notificationId) => {
  try {
    return await Notification.findById(notificationId)
  } catch (error) {
    throw new Error(error)
  }
}

const findManyAndSort = async (findOptions, sortOptions) => {
  try {
    return await Notification.find(findOptions).sort(sortOptions)
  } catch (error) {
    throw new Error(error)
  }
}

const deleteById = async (notificationId) => {
  try {
    return await Notification.findByIdAndDelete(notificationId)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  insert,
  findById,
  findManyAndSort,
  deleteById
}