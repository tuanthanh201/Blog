const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const { DataSource } = require('apollo-datasource')
const { AuthenticationError, UserInputError } = require('apollo-server')

const { checkAuth, validatePostInput } = require('../utils')
const { uploadBase64Image, deleteImages, getCloudFrontUrl } = require('../S3')

class PostService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async findPostById(postId) {
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

  async findPostsByTerm(term) {
    try {
      console.log(term)
      const searchOption = { $regex: `/${term}/`, $options: 'i' }
      const posts = await this.store.postRepo.findMany({
        $or: [{ title: searchOption }, { 'tags.content': searchOption }],
      })
      console.log(posts)
      return posts
    } catch (error) {
      throw new Error(error)
    }
  }

  async createPost({ postInput, userId }) {
    try {
      let { title, body, image, tags } = postInput
      // TODO: uncomment this
      // const user = await checkAuth(this.context.req, this.store.userRepo)
      const user = await this.store.userRepo.findById(userId)
      validatePostInput(postInput)

      let newPost = {
        author: user._id,
        title,
        body,
      }

      // check if user uploads an image
      if (image !== '') {
        const { Key } = await uploadBase64Image(image)
        newPost.image = Key
      }

      // check if user includes any tags
      if (tags !== '') {
        tags = tags.split(' ')
        console.log(tags)
        newPost.tags = []
        for (const content of tags) {
          console.log(content)
          let tag = await this.store.tagRepo.findOne({ content })
          if (!tag) {
            // if tag doesnt exist then create tag and add it to post
            tag = await this.store.tagRepo.insert(content)
          }
          newPost.tags.push({ tagId: tag._id, content })
        }
      }
      newPost = await this.store.postRepo.insert(newPost)
      // save post to user
      user.posts.push(newPost._id)
      await this.store.userRepo.save(user)
      return newPost
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteImage({ postId }) {
    try {
      // const user = await checkAuth(this.context.req, this.store.userRepo)
      const post = await this.store.postRepo.findById(postId)
      // if (!user.posts.includes(postId)) {
      //   throw new Error("You don't have permission to edit this post")
      // }
      if (!post.image) {
        throw new Error("This post doesn't have an image")
      }
      await deleteImages([post.image])
      post.image = null
      return await this.store.postRepo.save(post)
    } catch (error) {
      throw new Error(error)
    }
  }

  async editPost(args) {
    try {
      const { postId, postInput, userId } = args
      // const user = await checkAuth(this.context.req, this.store.userRepo)
      const user = await this.store.userRepo.findById(userId)
      validatePostInput(postInput)

      if (user.posts.includes(postId)) {
        // check if user includes tags
        if (postInput.tags !== '') {
          const tags = postInput.tags.split(' ')
          postInput.tags = []
          for (content of tags) {
            let tag = await this.store.tagRepo.findOne({ content })
            if (!tag) {
              // if tag doesnt exist then create tag and add it to post
              tag = await this.store.tagRepo.insert(content)
            }
            postInput.tags.push({ tagId: tag._id, content })
          }
        }
        const newPost = await this.store.bookRepo.updateById(postId, postInput)
        if (!newPost) {
          throw new Error('Post does not exist')
        }
        return newPost
      } else {
        throw new AuthenticationError("You don't have permission to edit this post")
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async deletePost(postId) {
    try {
      console.log(postId)
      // const user = await checkAuth(this.context.req, this.store.userRepo)
      // if (!user.posts.includes(postId)) {
      //   throw new AuthenticationError(
      //     "You don't have permission to delete this post"
      //   )
      // }
      await this.store.postRepo.deleteById(postId)
      user.posts.filter((post) => post !== postId)
      // remove post from user's posts
      await this.store.userRepo.save(user)
      return 'Post deleted'
    } catch (error) {
      throw new Error(error)
    }
  }

  async createComment({ postId, body }) {
    try {
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const post = await this.store.postRepo.findById(postId)
      if (body === undefined || body.trim() === '') {
        throw new UserInputError('Comment must not be empty')
      }
      if (!post) {
        throw new Error("Post doesn't exist")
      }
      post.comments.push({ author: user._id, body })
      return await this.store.postRepo.save(post)
    } catch (error) {
      throw new Error(error)
    }
  }

  async editComment({ postId, commentId, body }) {
    try {
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const post = await this.store.postRepo.findById(postId)
      const comment = post.comments.find((comment) => comment._id === commentId)
      if (!comment) {
        throw new Error('Comment doesn not exist')
      }
      if (comment.user !== user._id) {
        throw new AuthenticationError(
          "You don't have permission to edit this comment"
        )
      }
      comment.body = body
      return await this.store.postRepo.save(post)
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteComment({ postId, commentId }) {
    try {
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const post = await this.store.postRepo.findById(postId)
      if (!user.posts.includes) {
        throw new AuthenticationError(
          "You don't have permission to edit this post"
        )
      }

      const comment = post.comments.find((comment) => comment._id === commentId)
      if (!comment) {
        throw new Error('Comment doesn not exist')
      }
      if (comment.user !== user._id) {
        throw new AuthenticationError(
          "You don't have permission to delete this comment"
        )
      }
      post.comments = post.comments.filter(
        (comment) => comment._id !== commentId
      )
      return await this.store.postRepo.save(post)
    } catch (error) {
      throw new Error(error)
    }
  }

  async likePost(postId) {
    try {
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const post = await this.store.postRepo.findById(postId)

      if (!post) {
        throw new Error('Post does not exist')
      }

      if (post.likes.includes(user._id)) {
        // unlike
        post.likes = post.likes.filter((like) => like !== user._id)
      } else {
        // like
        post.likes.push(user._id)
      }
      return await this.store.postRepo.save(post)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = PostService
