const resolvers = {
  Query: {
    async findImageById(_, args, { dataSources }) {
      return await dataSources.imageService.findImageById(args.imageId)
    },
    async findImagesByIds(_, args, { dataSources }) {
      return await dataSources.imageService.findImagesByIds(args.imageIds)
    },
  },
  Mutation: {
    async insertImage(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.imageService.insertImage(args.image)
    },
  },
}

module.exports = resolvers
