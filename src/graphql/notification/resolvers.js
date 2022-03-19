const resolvers = {
  Notification: {
    async user(parent, _, { dataSources }) {
      return await dataSources.userService.findUserById(parent.user)
    },
    async author(parent, _, { dataSources }) {
      return await dataSources.userService.findUserById(parent.author)
    },
    async post(parent, _, { dataSources }) {
      return await dataSources.postService.findPostById(parent.post)
    },
  },
  Query: {
    async findNotificationToUser(_, __, { dataSources }) {
      return await dataSources.notificationService.findNotificationToUser()
    },
  },
  Mutation: {
    async deleteNotification(_, args, { dataSources }) {
      return await dataSources.notificationService.deleteNotification(
        args.notificationId
      )
    },
  },
}

module.exports = resolvers
