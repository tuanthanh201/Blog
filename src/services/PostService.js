const { DataSource } = require('apollo-datasource')
const { AuthenticationError, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')

const { checkAuth, validatePostInput } = require('../utils')
const { uploadBase64Image, deleteImages, getCloudFrontUrl } = require('../S3')

class PostService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
    this.limit = 11
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

  getPostQuery(posts) {
    const postsLength = posts.length
    let last = posts[postsLength - 1]?._id
    let hasMore = false
    if (postsLength === this.limit) {
      posts.pop()
      hasMore = true
      last = posts[postsLength - 2]?._id
    }
    return { posts, hasMore, last }
  }

  async findAllPosts(cursor) {
    try {
      const findOption = cursor ? { _id: { $lt: cursor } } : {}
      const posts = await this.store.postRepo.findManyAndSort(
        findOption,
        { _id: -1 },
        this.limit
      )
      return this.getPostQuery(posts)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findPostsByAuthor(authorId) {
    try {
      return await this.store.postRepo.findManyAndSort(
        { author: authorId },
        { _id: -1 }
      )
    } catch (error) {}
  }

  async findPostsByTermSortNewest(term, cursor) {
    try {
      const searchOption = { $regex: `${term}`, $options: 'i' }
      const findOption = cursor
        ? {
            $and: [
              { _id: { $lt: cursor } },
              { $or: [{ title: searchOption }] },
            ],
          }
        : { $or: [{ title: searchOption }] }
      const posts = await this.store.postRepo.findManyAndSort(
        findOption,
        { _id: -1 },
        this.limit
      )
      return this.getPostQuery(posts)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findPostsByTermSortTrending(term, cursor) {
    try {
      const searchOption = { $regex: `${term}`, $options: 'i' }
      const findOption = cursor
        ? {
            $and: [
              { _id: { $lt: mongoose.Types.ObjectId(cursor) } },
              { $or: [{ title: searchOption }] },
            ],
          }
        : { $or: [{ title: searchOption }] }
      const aggregations = [
        { $match: findOption },
        {
          $addFields: {
            popularity: {
              $divide: [
                { $size: '$likes' },
                {
                  $pow: [
                    {
                      $add: [
                        {
                          $dateDiff: {
                            startDate: '$createdAt',
                            endDate: new Date(),
                            unit: 'hour',
                          },
                        },
                        2,
                      ],
                    },
                    1.5,
                  ],
                },
              ],
            },
          },
        },
      ]
      const posts = await this.store.postRepo.findAndSortByAggrField(
        aggregations,
        { popularity: -1, _id: -1 },
        this.limit
      )
      return this.getPostQuery(posts)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findPostsByTagSortNewest(tag, cursor) {
    try {
      const searchOption = { $regex: `${tag}`, $options: 'i' }
      const findOption = cursor
        ? { $and: [{ _id: { $lt: cursor } }, { 'tags.content': searchOption }] }
        : { 'tags.content': searchOption }
      const posts = await this.store.postRepo.findManyAndSort(
        findOption,
        { _id: -1 },
        this.limit
      )
      return this.getPostQuery(posts)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findPostsByTagSortTrending(tag, cursor) {
    try {
      const searchOption = { $regex: `${tag}`, $options: 'i' }
      const findOption = cursor
        ? {
            $and: [{ _id: { $lt: cursor } }, { 'tags.content': searchOption }],
          }
        : { 'tags.content': searchOption }
      const aggregations = [
        {
          $match: findOption,
        },
        {
          $addFields: {
            popularity: {
              $divide: [
                { $size: '$likes' },
                {
                  $pow: [
                    {
                      $add: [
                        {
                          $dateDiff: {
                            startDate: '$createdAt',
                            endDate: new Date(),
                            unit: 'hour',
                          },
                        },
                        2,
                      ],
                    },
                    1.5,
                  ],
                },
              ],
            },
          },
        },
      ]
      const posts = await this.store.postRepo.findAndSortByAggrField(
        aggregations,
        { popularity: -1, _id: -1 },
        this.limit
      )
      return this.getPostQuery(posts)
    } catch (error) {
      throw new Error(error)
    }
  }

  async createPost({ postInput }) {
    try {
      let { title, body, image, tags } = postInput
      const user = await checkAuth(this.context.req, this.store.userRepo)
      validatePostInput(postInput)

      let newPost = {
        author: user._id,
        title,
        body,
      }

      // check if user uploads an image
      if (image.trim() !== '') {
        const { Key } = await uploadBase64Image(image)
        newPost.image = Key
      }

      // check if user includes any tags
      if (tags.trim() !== '') {
        tags = tags.split(' ')
        newPost.tags = []
        for (let content of tags) {
          content = content.trim()
          if (content !== '') {
            let tag = await this.store.tagRepo.findOne({ content })
            if (!tag) {
              // if tag doesnt exist then create tag and add it to post
              tag = await this.store.tagRepo.insert(content)
            }
            newPost.tags.push({ tagId: tag._id, content })
          }
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

  getImageUrl = (imageKey) => {
    if (imageKey !== '') {
      return getCloudFrontUrl(imageKey)
    }
    return null
  }

  async editPost(args) {
    try {
      const { postId, postInput } = args
      validatePostInput(postInput)
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const post = await this.store.postRepo.findById(postId)

      if (!post) {
        throw new Error('Post does not exist')
      }

      if (user.posts.some((post) => post._id.toString() === postId)) {
        // check if user includes tags
        post.tags = []
        if (postInput.tags.trim() !== '') {
          const tags = postInput.tags.split(' ')
          for (const content of tags) {
            if (content.trim() !== '') {
              let tag = await this.store.tagRepo.findOne({ content })
              if (!tag) {
                // if tag doesnt exist then create tag and add it to post
                tag = await this.store.tagRepo.insert(content)
              }
              post.tags.push({ tagId: tag._id, content })
            }
          }
        }

        // check if user includes image
        if (postInput.image.trim() !== '') {
          // replace current image with new image
          if (post.image !== '') {
            await deleteImages([post.image])
          }
          const { Key } = await uploadBase64Image(postInput.image)
          post.image = Key
        }

        post.title = postInput.title
        post.body = postInput.body
        return await this.store.postRepo.save(post)
      } else {
        throw new AuthenticationError(
          "You don't have permission to edit this post"
        )
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async deletePost(postId) {
    try {
      const user = await checkAuth(this.context.req, this.store.userRepo)
      const post = await this.store.postRepo.findById(postId)
      if (!post) {
        throw new Error('Post does not exist')
      }
      if (!user.posts.some((post) => post._id.toString() === postId)) {
        throw new AuthenticationError(
          "You don't have permission to delete this post"
        )
      }
      if (post.image !== '') {
        await deleteImages([post.image])
      }
      await this.store.postRepo.deleteById(postId)
      user.posts = user.posts.filter((post) => post._id.toString() !== postId)
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
      if (!post) {
        throw new Error("Post doesn't exist")
      }
      if (body === undefined || body.trim() === '') {
        throw new UserInputError('Comment must not be empty')
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

      if (
        post.likes.some((like) => like._id.toString() === user._id.toString())
      ) {
        // unlike
        post.likes = post.likes.filter(
          (like) => like._id.toString() !== user._id.toString()
        )
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
