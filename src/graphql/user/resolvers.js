const resolvers = {
  User: {
    id: (parent) => parent._id || parent.id,
    async posts(parent, args, { dataSources }) {
      return await dataSources.postService.findPostsByAuthor(parent.id)
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
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.userService.updateBio(args)
    },
    async subscribe(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.userService.subscribe(args.userId)
    },
    async register(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.userService.register(args)
    },
    async login(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.userService.login(args)
    },
    async logout(_, __, { dataSources }) {
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.userService.logout()
    },
  },
}

module.exports = resolvers
