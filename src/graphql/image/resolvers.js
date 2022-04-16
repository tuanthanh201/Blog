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
    async deleteImageById(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.imageService.deleteImageById(args.imageId)
    },
    async deleteImagesByIds(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit()
      return await dataSources.imageService.deleteImagesByIds(args.imageIds)
    },
  },
}

module.exports = resolvers
