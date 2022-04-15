const resolvers = {
  Post: {
    id: (parent) => parent._id || parent.id,
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    async author(parent, _, { dataSources }) {
      return await dataSources.userService.findUserById(parent.author)
    },
    async tags(parent, _, { dataSources }) {
      return await dataSources.tagService.findTagsByTagObjs(parent.tags)
    },
    image(parent, _, { dataSources }) {
      return dataSources.postService.getImageUrl(parent.image)
    },
  },
  Comment: {
    id: (parent) => parent._id || parent.id,
    async author(parent, _, { dataSources }) {
      return await dataSources.userService.findUserById(parent.author)
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
      return await dataSources.postService.findPostsByTag(
        args.tag,
        args.cursor
      )
    },
  },
  Mutation: {
    async createPost(_, args, { dataSources }) {
      return await dataSources.postService.createPost(args)
    },
    async editPost(_, args, { dataSources }) {
      return await dataSources.postService.editPost(args)
    },
    async deletePost(_, args, { dataSources }) {
      return await dataSources.postService.deletePost(args.postId)
    },
    async createComment(_, args, { dataSources }) {
      return await dataSources.postService.createComment(args)
    },
    async editComment(_, args, { dataSources }) {
      return await dataSources.postService.editComment(args)
    },
    async deleteComment(_, args, { dataSources }) {
      return await dataSources.postService.deleteComment(args)
    },
    async likePost(_, args, { dataSources }) {
      return await dataSources.postService.likePost(args.postId)
    },
  },
}

module.exports = resolvers
