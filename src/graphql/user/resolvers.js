const resolvers = {
  User: {
    async posts(parent, args, { dataSources }) {
      return await dataSources.postService.findPostsByIds(parent.posts)
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
}

module.exports = resolvers
