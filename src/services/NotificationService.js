const { DataSource } = require('apollo-datasource')
const { AuthenticationError } = require('apollo-server')

const checkAuth = require('../utils/checkAuth')

class NotificationService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async creatNotification(notification) {
    try {
      return await this.store.notificationRepo.insert(notification)
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteNotification(notificationId) {
    try {
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const notification = await this.store.notificationRepo.findById(
        notificationId
      )
      if (!notification) {
        throw new Error('Notification does not exist')
      }
      if (user._id.toString() !== notification.user._id.toString()
      ) {
        throw new AuthenticationError(
          "You don't have permission to delete this notification"
        )
      }
      await this.store.deleteById(notificationId)
      user.notifications = user.notifications.filter(
        (notification) => notification._id.toString() !== notificationId
      )
      return this.store.userRepo.save(user)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = NotificationService
