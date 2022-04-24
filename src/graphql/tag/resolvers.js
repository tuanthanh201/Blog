const resolvers = {
  Query: {
    async findAllTags(_, __, { dataSources }) {
      return await dataSources.tagService.findAllTags()
    },
  },
}

module.exports = resolvers
