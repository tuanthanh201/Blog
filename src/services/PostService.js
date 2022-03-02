const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const { DataSource } = require('apollo-datasource')
const { AuthenticationError, UserInputError } = require('apollo-server')

const { checkAuth } = require('../utils')

class PostService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async findPostById({ postId }) {
    try {
      return await this.store.postRepo.findById(postId)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllPosts() {
    try {
      return await this.store.postRepo.findAll()
    } catch (error) {
      throw new Error(error)
    }
  }

  async findPostsByTitle(args) {}

  async findPostsByTags() {}

  async editPost(args) {
    const { postId } = args
    const user = await checkAuth(this.context.req, this.store.userRepo)

    if (user._doc.posts.includes(postId)) {
      // image later
      const newPost = await this.store.bookRepo.updateById(postId, args)
      if (!newPost) {
        throw new Error('Post does not exist')
      }
      return newPost
    } else {
      throw AuthenticationError('Permission denied')
    }
  }

  async deletePost({ postId }) {}

  async addTag(args) {}

  async removeTag(args) {}

  async createComment(args) {}

  async deleteComment(args) {}

  async likePost({postId}) {
    const user = await checkAuth(this.context.req, this.store.userRepo)
    const post = await this.store.postRepo.findById(postId)

    if (!post) {
      throw new Error('Post does not exist')
    }

    // check if user already liked this post
  }
}

module.exports = PostService
