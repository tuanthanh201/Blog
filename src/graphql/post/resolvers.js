const resolvers = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    async author(parent, args, { dataSources }) {
      return await dataSources.userService.findUserById(parent.author)
    },
    async tags(parent, args, {dataSources}) {
      return await dataSources.tagService.findTagsById(parent.tags)
    }
  },
  Query: {
    async findPostById(_, args, { dataSources }) {
      return await dataSources.postService.findPostById(args.postId)
    },
    async findAllPosts(_, __, { dataSources }) {
      return await dataSources.postService.findAllPosts()
    },
    async findPostsByTerm(_, args, { dataSources }) {
      return await dataSources.postService.findPostsByTerm(args.term)
    },
  },
  Mutation: {
    async createPost(_, args, { dataSources }) {
      return await dataSources.postService.createPost(args)
    },
    async deleteImage(_, args, { dataSources }) {
      return await dataSources.postService.deleteImage(args)
    },
    async editPost(_, args, { dataSources }) {
      return await dataSources.postService.editPost(args)
    },
    async deletePost(_, args, { dataSources }) {
      return await dataSources.postService.deletePost(args.postId)
    },
    async addTag(_, args, { dataSources }) {
      return await dataSources.postService.addTag(args)
    },
    async removeTag(_, args, { dataSources }) {
      return await dataSources.postService.removeTag(args)
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
