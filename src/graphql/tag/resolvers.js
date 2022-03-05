const resolvers = {
  Query: {
    async findTagById(_, args, { dataSources }) {
      return await dataSources.tagService.findTagById(args.tagId)
    },
    // TODO: check this ._.
    async findTagsByContent(_, args, { dataSources }) {
      return await dataSources.tagService.findTagsByContent(args.content)
    },
    async findTagByContentExact(_, args, { dataSources }) {
      return await dataSources.tagService.findTagByContentExact(args.content)
    },
    async findAllTags(_, __, { dataSources }) {
      return await dataSources.tagService.findAllTags()
    },
  },
}

module.exports = resolvers
