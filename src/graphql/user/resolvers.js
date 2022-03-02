const resolvers = {
  Query: {
    async findUserById(_, args, { dataSources }) {
      return await dataSources.userService.findUserById(args)
    },
    async findAllUsers(_, __, { dataSources }) {
      return await dataSources.userService.findAllUsers()
    },
    async getMe(_, __, { dataSources }) {
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
