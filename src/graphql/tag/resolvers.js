const resolvers = {
  Query: {
    async findTagById(parent, args, { dataSources }) {
      return await dataSources.tagService.findTagById(args.tagId)
    },
    // TODO: check this ._.
    async findTagsByContent(_, args, {dataSources}) {
      return await dataSources.tagService.findTagsByContent(args)
    },
    async findAllTags(_, __, { dataSources }) {
      return await dataSources.tagService.findAllTags()
    },
  },
  Mutation: {
    async createTag(_, args, { dataSources }) {
      return await dataSources.tagService.createTag(args)
    },
  },
}

module.exports = resolvers
