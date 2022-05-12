const { DataSource } = require('apollo-datasource')
const { AuthenticationError, UserInputError } = require('apollo-server')

const { checkAuth, validatePostInput } = require('../utils')
const { uploadBase64Image, deleteImages, getCloudFrontUrl } = require('../S3')

const fieldsOrder = [
  '_id',
  'author',
  'title',
  'body',
  'image',
  'likes',
  'comments',
  'tags',
  'tagId',
  'content',
  'createdAt',
  '__v',
]

const cacheExpired = (timeLeft) => timeLeft === -1 || timeLeft === -2

class PostService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
    this.limit = 11
    this.cachedPostsKey = 'cachedPosts'
    this.cachedPostsExpiration = 30 * 60
    this.cacheSize = 100
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

  async findPostsByIds(postIds) {
    try {
      return await this.store.postRepo.findManyAndSort(
        { _id: { $in: postIds } },
        { _id: -1 }
      )
    } catch (error) {
      throw new Error(error)
    }
  }

  getPostQuery(posts) {
    const postsLength = posts.length
    const postIds = posts.map((post) => post._id.toString())
    let last = postIds[postIds.length - 1]
    let hasMore = false
    if (postsLength === this.limit) {
      posts.pop()
      hasMore = true
      last = postIds[postIds.length - 2]
    }
    return { posts, hasMore, last }
  }

  async findAllPosts(cursor) {
    try {
      const cachedPosts = await this.context.redis.lRange(
        this.cachedPostsKey,
        0,
        -1
      )
      const cachedPostsLength = cachedPosts.length
      let postsToFetch = this.limit
      let posts = []
      if (cachedPostsLength !== 0) {
        const parsedPosts = cachedPosts.map((post) => {
          let parsedPost = JSON.parse(post)
          parsedPost.createdAt = new Date(parsedPost.createdAt)
          return parsedPost
        })
        let postIndex = parsedPosts.findIndex((post) => post._id === cursor)
        let postIsCached = false
        if (postIndex !== -1) {
          postIsCached = true
          postIndex++
        } else if (postIndex === -1 && !cursor) {
          postIsCached = true
          postIndex = 0
        }
        if (postIsCached) {
          for (let i = postIndex; i < postIndex + this.limit; i++) {
            if (i >= cachedPostsLength) {
              break
            }
            posts.push(parsedPosts[i])
            cursor = parsedPosts[i]._id
            postsToFetch--
          }
        }
      }
      if (postsToFetch !== 0) {
        const findOption = cursor ? { _id: { $lt: cursor } } : {}
        const fetchedPosts = await this.store.postRepo.findManyAndSort(
          findOption,
          { _id: -1 },
          postsToFetch
        )
        posts = posts.concat(fetchedPosts)
      }
      if (cachedPostsLength === 0) {
        let postsToCache = await this.store.postRepo.findManyAndSort(
          {},
          { _id: -1 },
          this.cacheSize
        )
        postsToCache = postsToCache.map((post) =>
          JSON.stringify(post, fieldsOrder)
        )
        if (postsToCache.length !== 0) {
          await this.context.redis.rPush(this.cachedPostsKey, postsToCache)
        }
        const timeLeft = await this.context.redis.ttl(this.cachedPostsKey)
        if (cacheExpired(timeLeft)) {
          await this.context.redis.expire(
            this.cachedPostsKey,
            this.cachedPostsExpiration
          )
        }
      }
      return this.getPostQuery(posts)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findPostsByTerm(term, cursor) {
    try {
      const searchOption = { $regex: `${term}`, $options: 'i' }
      const findOption = cursor
        ? {
            $and: [{ _id: { $lt: cursor } }, { title: searchOption }],
          }
        : { title: searchOption }
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

  async findPostsByTag(tag, cursor) {
    try {
      const searchOption = { $regex: `${tag}`, $options: 'i' }
      const findOption = cursor
        ? {
            $and: [{ _id: { $lt: cursor } }, { 'tags.content': searchOption }],
          }
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

      // insert post into database
      newPost = await this.store.postRepo.insert(newPost)
      // save post to user
      user.posts.push(newPost._id)
      await this.store.userRepo.save(user)

      // store post into cache
      const cachedPostsCount = await this.context.redis.lLen(
        this.cachedPostsKey
      )
      if (cachedPostsCount === this.cacheSize) {
        await this.context.redis.rPop(this.cachedPostsKey)
      }
      await this.context.redis.lPush(
        this.cachedPostsKey,
        JSON.stringify(newPost, fieldsOrder)
      )
      const timeLeft = await this.context.redis.ttl(this.cachedPostsKey)
      if (cacheExpired(timeLeft)) {
        await this.context.redis.expire(
          this.cachedPostsKey,
          this.cachedPostsExpiration
        )
      }
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

        // edit cache
        const cachedPosts = await this.context.redis.lRange(
          this.cachedPostsKey,
          0,
          -1
        )
        const cachedPostsLength = cachedPosts.length
        for (let i = 0; i < cachedPostsLength; i++) {
          const cachedPost = JSON.parse(cachedPosts[i])
          if (cachedPost._id.toString() === post._id.toString()) {
            await this.context.redis.lSet(
              this.cachedPostsKey,
              i,
              JSON.stringify(post, fieldsOrder)
            )
            break
          }
        }
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
      user.posts = user.posts.filter((post) => post._id.toString() !== postId)
      await this.store.postRepo.deleteById(postId)
      // remove post from user's posts
      await this.store.userRepo.save(user)
      // clean up cache is post is cached
      const stringifiedPost = JSON.stringify(post, fieldsOrder)
      const removedCachedPost = await this.context.redis.lRem(
        this.cachedPostsKey,
        0,
        stringifiedPost
      )
      if (removedCachedPost !== 0) {
        const cachedPosts = await this.context.redis.lRange(
          this.cachedPostsKey,
          0,
          -1
        )
        const cachedPostsLength = cachedPosts.length
        let cursor
        if (cachedPostsLength > 0) {
          cursor = JSON.parse(cachedPosts[cachedPostsLength - 1])._id
        }
        const findOption = cursor ? { _id: { $lt: cursor } } : {}
        const fetchedPosts = await this.store.postRepo.findManyAndSort(
          findOption,
          { _id: -1 },
          removedCachedPost
        )
        const postsToCache = fetchedPosts.map((post) =>
          JSON.stringify(post, fieldsOrder)
        )
        if (postsToCache.length !== 0) {
          await this.context.redis.rPush(this.cachedPostsKey, postsToCache)
        }
      }
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
      const savedPost = await this.store.postRepo.save(post)

      // edit cache
      const cachedPosts = await this.context.redis.lRange(
        this.cachedPostsKey,
        0,
        -1
      )
      const cachedPostsLength = cachedPosts.length
      for (let i = 0; i < cachedPostsLength; i++) {
        const cachedPost = JSON.parse(cachedPosts[i])
        if (cachedPost._id.toString() === post._id.toString()) {
          await this.context.redis.lSet(
            this.cachedPostsKey,
            i,
            JSON.stringify(savedPost, fieldsOrder)
          )
          break
        }
      }
      return savedPost
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
      const savedPost = await this.store.postRepo.save(post)

      // edit cache
      const cachedPosts = await this.context.redis.lRange(
        this.cachedPostsKey,
        0,
        -1
      )
      const cachedPostsLength = cachedPosts.length
      for (let i = 0; i < cachedPostsLength; i++) {
        const cachedPost = JSON.parse(cachedPosts[i])
        if (cachedPost._id.toString() === post._id.toString()) {
          await this.context.redis.lSet(
            this.cachedPostsKey,
            i,
            JSON.stringify(savedPost, fieldsOrder)
          )
          break
        }
      }
      return savedPost
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = PostService
