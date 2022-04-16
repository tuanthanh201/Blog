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
      await dataSources.rateLimitService.rateLimit({
        type: 'insertImage',
        interval: 60 * 1000,
        callsPerInterval: 500,
      })
      return await dataSources.imageService.insertImage(args.image)
    },
  },
}

module.exports = resolvers
