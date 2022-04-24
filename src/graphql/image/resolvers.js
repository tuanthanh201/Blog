const resolvers = {
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
