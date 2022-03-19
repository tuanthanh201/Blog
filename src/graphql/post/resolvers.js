const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

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
    async findAllPosts(_, __, { dataSources }) {
      const posts = await dataSources.postService.findAllPosts()
      pubsub.publish('POSTS_FETCHED', { postsFetched: posts })
      return posts
    },
    async findPostsByTermSortNewest(_, args, { dataSources }) {
      return await dataSources.postService.findPostsByTermSortNewest(args.term)
    },
    async findPostsByTermSortTrending(_, args, { dataSources }) {
      return await dataSources.postService.findPostsByTermSortTrending(
        args.term
      )
    },
    async findPostsByTagSortNewest(_, args, { dataSources }) {
      return await dataSources.postService.findPostsByTagSortNewest(args.tag)
    },
    async findPostsByTagSortTrending(_, args, { dataSources }) {
      return await dataSources.postService.findPostsByTagSortTrending(args.tag)
    },
  },
  Mutation: {
    async createPost(_, args, { dataSources }) {
      const post = await dataSources.postService.createPost(args)
      pubsub.publish('POST_CREATED', { postCreated: post })
      return post
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
  Subscription: {
    postCreated: {
      subscribe: (_, args, context) => {
        return context.dataSources.postService.newPostListening(context)
      },
    },
    postsFetched: {
      subscribe: () => {
        return pubsub.asyncIterator(['POSTS_FETCHED'])
      },
    },
  },
}

module.exports = resolvers
