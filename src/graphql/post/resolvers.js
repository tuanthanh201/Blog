const resolvers = {
  Post: {
    id: (parent) => parent._id || parent.id,
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    async author(parent, _, { dataSources, userLoader }) {
      return await userLoader.load(parent.author, dataSources.userService)
    },
    tags(parent) {
      return parent.tags.map((tag) => ({
        id: tag.tagId,
        content: tag.content,
      }))
    },
    image(parent, _, { dataSources }) {
      return dataSources.postService.getImageUrl(parent.image)
    },
  },
  Comment: {
    id: (parent) => parent._id || parent.id,
    async author(parent, _, { dataSources, userLoader }) {
      return await userLoader.load(parent.author, dataSources.userService)
    },
  },
  Query: {
    async findPostById(_, args, { dataSources }) {
      return await dataSources.postService.findPostById(args.postId)
    },
    async findAllPosts(_, args, { dataSources }) {
      return await dataSources.postService.findAllPosts(args.cursor)
    },
    async findPostsByTerm(_, args, { dataSources }) {
      return await dataSources.postService.findPostsByTerm(
        args.term,
        args.cursor
      )
    },
    async findPostsByTag(_, args, { dataSources }) {
      return await dataSources.postService.findPostsByTag(args.tag, args.cursor)
    },
  },
  Mutation: {
    async createPost(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit({
        type: 'createPost',
        interval: 60 * 1000,
        callsPerInterval: 500,
      })
      return await dataSources.postService.createPost(args)
    },
    async editPost(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit({
        type: 'editPost',
        interval: 60 * 1000,
        callsPerInterval: 500,
      })
      return await dataSources.postService.editPost(args)
    },
    async deletePost(_, args, { dataSources }) {
      return await dataSources.postService.deletePost(args.postId)
    },
    async createComment(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit({
        type: 'createComment',
        interval: 60 * 1000,
        callsPerInterval: 500,
      })
      return await dataSources.postService.createComment(args)
    },
    async likePost(_, args, { dataSources }) {
      await dataSources.rateLimitService.rateLimit({
        type: 'likePost',
        interval: 60 * 1000,
        callsPerInterval: 700,
      })
      return await dataSources.postService.likePost(args.postId)
    },
  },
}

module.exports = resolvers
