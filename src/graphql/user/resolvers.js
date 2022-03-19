const { PubSub } = require('graphql-subscriptions')
const { withFilter } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
  User: {
    id: (parent) => parent._id || parent.id,
    async posts(parent, args, { dataSources }) {
      return await dataSources.postService.findPostsByAuthor(parent.id)
    },
    async subscribers(parent, args, { dataSources }) {
      return await dataSources.userService.FindUsersByIds(
        parent.subscribers.map((subscriber) => subscriber._id)
      )
    },
    postsCount: (parent) => parent.posts.length,
  },
  Query: {
    async findUserById(parent, args, { dataSources }) {
      return await dataSources.userService.findUserById(args.userId)
    },
    async findAllUsers(parent, __, { dataSources }) {
      return await dataSources.userService.findAllUsers()
    },
    async getMe(parent, __, { dataSources }) {
      return await dataSources.userService.getMe()
    },
  },
  Mutation: {
    async updateBio(_, args, { dataSources }) {
      return await dataSources.userService.updateBio(args)
    },
    async subscribe(_, args, { dataSources }) {
      return await dataSources.userService.subscribe(args.userId)
    },
    async register(_, args, { dataSources }) {
      return await dataSources.userService.register(args)
    },
    async login(_, args, { dataSources }) {
      return await dataSources.userService.login(args)
    },
    async logout(_, __, { dataSources }) {
      return await dataSources.userService.logout()
    },
  },
  Subscription: {
    newNotification: {
      subscribe: withFilter(
        () => {
          console.log('listening')
          return pubsub.asyncIterator('NEW_NOTIFICATION')
        },
        (payload, variables) => {
          console.log(payload, variables)
          return payload.user.toString() === variables
        }
      ),
      // subscribe: (_, args, context) => {
      //   return context.dataSources.userService.newNotification(context)
      // },
    },
  },
}

module.exports = resolvers
