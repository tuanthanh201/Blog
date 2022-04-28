jest.mock('../../S3', () => ({
  uploadBase64Image: () => ({ Key: 'someKey' }),
  getCloudFrontUrl: () => 'someUrl',
  deleteImages: jest.fn(),
}))
const imageFunctions = require('../../S3')

const PostService = require('../PostService')

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const getMockStore = () => ({
  userRepo: {
    findById: jest.fn(),
    save: jest.fn(),
  },
  postRepo: {
    insert: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    findManyAndSort: jest.fn(),
    deleteById: jest.fn(),
  },
  tagRepo: {
    findOne: jest.fn(),
    insert: jest.fn(),
  },
})

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
let postService = null
let mockStore = null
beforeEach(() => {
  jest.resetModules()
  mockStore = getMockStore()
  postService = new PostService({ store: mockStore })
  postService.initialize({
    context: {
      req: { parsedToken: 'xyz' },
      redis: {
        rPop: jest.fn(),
        rPush: jest.fn(),
        lPush: jest.fn(),
        ttl: jest.fn(),
        lRange: jest.fn(),
        lLen: jest.fn(),
        lRem: jest.fn(),
        lSet: jest.fn(),
        expire: jest.fn(),
      },
    },
  })
})

describe('PostService.findPostById', () => {
  it('Finds post by id', async () => {
    // given
    const expectedPost = {
      id: 1,
    }
    mockStore.postRepo.findById.mockReturnValueOnce(expectedPost)

    // when
    const post = await postService.findPostById(expectedPost.id)

    // then
    expect(mockStore.postRepo.findById).toHaveBeenLastCalledWith(
      expectedPost.id
    )
    expect(post).toStrictEqual(expectedPost)
  })
})

describe('PostService.findPostsByIds', () => {
  it('Find posts by ids', async () => {
    // given
    const expectedPosts = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const postIds = expectedPosts.map((post) => post.id)
    mockStore.postRepo.findManyAndSort.mockReturnValueOnce(expectedPosts)

    // when
    const posts = await postService.findPostsByIds(postIds)

    // then
    expect(mockStore.postRepo.findManyAndSort).toHaveBeenLastCalledWith(
      { $in: postIds },
      { _id: -1 }
    )
    expect(posts).toStrictEqual(expectedPosts)
  })
})

const getTestStoredPosts = () => [
  { _id: '1', title: 'Post 1', createdAt: new Date(1650911154090) },
  { _id: '2', title: 'Post 2', createdAt: new Date(1650911154090) },
  { _id: '3', title: 'Post 3', createdAt: new Date(1650911154090) },
  { _id: '4', title: 'Post 4', createdAt: new Date(1650911154090) },
  { _id: '5', title: 'Post 5', createdAt: new Date(1650911154090) },
  { _id: '6', title: 'Post 6', createdAt: new Date(1650911154090) },
  { _id: '7', title: 'Post 7', createdAt: new Date(1650911154090) },
  { _id: '8', title: 'Post 8', createdAt: new Date(1650911154090) },
  { _id: '9', title: 'Post 9', createdAt: new Date(1650911154090) },
  { _id: '10', title: 'Post 10', createdAt: new Date(1650911154090) },
  { _id: '11', title: 'Post 11', createdAt: new Date(1650911154090) },
  { _id: '12', title: 'Post 12', createdAt: new Date(1650911154090) },
]
describe('PostService.findAllPosts', () => {
  // hasMore: a Boolean to tell whether the batch is the last batch
  // last: the id of the last post in batch
  it('Fetches posts from cache (no cursor)', async () => {
    // given
    const parsedPosts = getTestStoredPosts()
    const cachedPosts = parsedPosts.map((post) =>
      JSON.stringify(post, fieldsOrder)
    )
    const expectedPostQuery = {
      posts: parsedPosts.slice(0, parsedPosts.length - 2),
      hasMore: true,
      last: '10',
    }
    postService.context.redis.lRange.mockReturnValueOnce(cachedPosts)

    // when
    const postQuery = await postService.findAllPosts()

    // then
    expect(postQuery).toStrictEqual(expectedPostQuery)
  })

  it('Fetches posts from cache (cursor exists and enough posts in cache)', async () => {
    const parsedPosts = getTestStoredPosts()
    const cachedPosts = parsedPosts.map((post) =>
      JSON.stringify(post, fieldsOrder)
    )
    const expectedPostQuery = {
      posts: parsedPosts.slice(1, parsedPosts.length - 1),
      hasMore: true,
      last: '11',
    }
    postService.context.redis.lRange.mockReturnValueOnce(cachedPosts)

    // when
    const postQuery = await postService.findAllPosts('1')

    // then
    expect(postQuery).toStrictEqual(expectedPostQuery)
  })

  it('Fetches posts from both cache and database when cache does not have enough posts', async () => {
    const storedPosts = getTestStoredPosts()
    const cachedPosts = storedPosts
      .slice(0, 5)
      .map((post) => JSON.stringify(post))
    const databasePosts = storedPosts.slice(5, 11)
    const expectedPostQuery = {
      posts: [
        ...storedPosts.slice(0, 5),
        ...databasePosts.slice(0, databasePosts.length - 1),
      ],
      hasMore: true,
      last: '10',
    }
    postService.context.redis.lRange.mockReturnValueOnce(cachedPosts)
    mockStore.postRepo.findManyAndSort.mockReturnValueOnce(databasePosts)

    // when
    const postQuery = await postService.findAllPosts()

    // then
    expect(mockStore.postRepo.findManyAndSort).toHaveBeenLastCalledWith(
      { _id: { $lt: '5' } },
      { _id: -1 },
      6
    )
    expect(postQuery).toStrictEqual(expectedPostQuery)
  })

  it('Caches posts if cache is empty', async () => {
    // given
    const storedPosts = getTestStoredPosts()
    const expectedPostQuery = {
      posts: storedPosts.slice(0, 10),
      hasMore: true,
      last: '10',
    }
    postService.context.redis.lRange.mockReturnValueOnce([])
    postService.context.redis.ttl.mockReturnValueOnce(-1)
    mockStore.postRepo.findManyAndSort
      .mockReturnValueOnce(storedPosts.slice(0, 11))
      .mockReturnValueOnce(storedPosts)

    // when
    const postQuery = await postService.findAllPosts()

    // then
    expect(postQuery).toStrictEqual(expectedPostQuery)
    expect(mockStore.postRepo.findManyAndSort).toHaveBeenNthCalledWith(
      1,
      {},
      { _id: -1 },
      11
    )
    expect(mockStore.postRepo.findManyAndSort).toHaveBeenNthCalledWith(
      2,
      {},
      { _id: -1 },
      100
    )
    expect(postService.context.redis.rPush).toHaveBeenLastCalledWith(
      'cachedPosts',
      storedPosts.map((post) => JSON.stringify(post, fieldsOrder))
    )
    expect(postService.context.redis.expire).toHaveBeenLastCalledWith(
      'cachedPosts',
      60 * 60
    )
  })
})

describe('PostService.findPostsByTerm', () => {
  it('Finds posts with titles containing search term', async () => {
    // given
    const term = 'a'
    const expectedPosts = [
      { _id: '8', title: 'Daylight' },
      { _id: '6', title: 'Dawn' },
      { _id: '1', title: 'Apple' },
    ]
    const expectedPostQuery = {
      posts: expectedPosts,
      hasMore: false,
      last: '1',
    }
    mockStore.postRepo.findManyAndSort.mockReturnValueOnce(expectedPosts)

    // when
    const postQuery = await postService.findPostsByTerm(term)

    // then
    expect(postQuery).toStrictEqual(expectedPostQuery)
    expect(mockStore.postRepo.findManyAndSort).toHaveBeenLastCalledWith(
      { title: { $regex: `${term}`, $options: 'i' } },
      { _id: -1 },
      11
    )
  })
})

describe('PostService.findPostsByTag', () => {
  const storedPosts = [
    {
      _id: '10',
      title: 'Midnight',
      tags: [{ _id: '1', content: 'cat' }],
    },
    {
      _id: '9',
      title: 'Morning',
      tags: [],
    },
    {
      _id: '8',
      title: 'Daylight',
      tags: [{ _id: '1', content: 'cat' }],
    },
    {
      _id: '7',
      title: 'Sunshine',
      tags: [{ _id: '2', content: 'dog' }],
    },
    {
      _id: '6',
      title: 'Dawn',
      tags: [{ _id: '1', content: 'cat' }],
    },
    {
      _id: '5',
      title: 'Dusk',
      tags: [{ _id: '2', content: 'dog' }],
    },
    {
      _id: '4',
      title: 'Noon',
      tags: [{ _id: '2', content: 'dog' }],
    },
    {
      _id: '3',
      title: 'Sun',
      tags: [
        { _id: '1', content: 'cat' },
        { _id: '2', content: 'dog' },
      ],
    },
    {
      _id: '2',
      title: 'Moon',
      tags: [
        { _id: '1', content: 'cat' },
        { _id: '2', content: 'dog' },
      ],
    },
    {
      _id: '1',
      title: 'Apple',
      tags: [{ _id: '1', content: 'cat' }],
    },
  ]

  it('Finds posts containing tag', async () => {
    // given
    const containTag = (tags, tagContent) => {
      const tagIndex = tags.findIndex((tag) => tag.content === tagContent)
      return tagIndex !== -1
    }
    const tag = 'cat'
    const expectedPosts = storedPosts.filter((post) =>
      containTag(post.tags, tag)
    )
    const expectedPostQuery = {
      posts: expectedPosts,
      hasMore: false,
      last: expectedPosts[expectedPosts.length - 1]._id,
    }
    mockStore.postRepo.findManyAndSort.mockReturnValueOnce(expectedPosts)

    // when
    const postQuery = await postService.findPostsByTag(tag)

    // then
    expect(postQuery).toStrictEqual(expectedPostQuery)
  })
})

describe('PostService.createPost', () => {
  it('Fails if title is empty', async () => {
    // given
    const args = {
      postInput: {
        title: '',
        body: 'Hello world',
        image: 'base64Image',
        tags: 'cat dog',
      },
    }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)

    await expect(async () => {
      await postService.createPost(args)
    }).rejects.toThrow('Title must not be empty')
  })

  it('Fails if body is empty', async () => {
    // given
    const args = {
      postInput: {
        title: 'New post',
        body: '',
        image: 'base64Image',
        tags: 'cat dog',
      },
    }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)

    // then
    await expect(async () => {
      await postService.createPost(args)
    }).rejects.toThrow('Body must not be empty')
  })

  it('Uploads image to S3', async () => {
    // given
    const args = {
      postInput: {
        title: 'New post',
        body: 'Hello world',
        image: 'base64Image',
        tags: '',
      },
    }
    const user = { _id: '1', posts: [] }
    const expectedPost = {
      _id: '1',
      author: user._id,
      title: args.postInput.title,
      body: args.postInput.body,
      image: 'someKey',
      tags: [],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.insert.mockReturnValueOnce(expectedPost)
    mockStore.userRepo.save.mockReturnValueOnce({
      ...user,
      posts: [expectedPost._id],
    })
    postService.context.redis.ttl.mockReturnValueOnce(3000)

    // when
    const post = await postService.createPost(args)

    // then
    expect(post).toEqual(expectedPost)
    expect(mockStore.postRepo.insert).toHaveBeenLastCalledWith({
      author: user._id,
      title: args.postInput.title,
      body: args.postInput.body,
      image: 'someKey',
    })
    expect(mockStore.userRepo.save).toHaveBeenLastCalledWith({
      ...user,
      posts: [expectedPost._id],
    })
  })

  it('Attaches tag or creates one if tag does already not exist', async () => {
    // given
    const args = {
      postInput: {
        title: 'New post',
        body: 'Hello world',
        image: '',
        tags: 'apple tomato',
      },
    }
    const user = { _id: '1', posts: [] }
    const expectedPost = {
      ...args.postInput,
      _id: '1',
      author: user._id,
      tags: [
        { tagId: '1', content: 'apple' },
        { tagId: '2', content: 'tomato' },
      ],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.tagRepo.findOne
      .mockReturnValueOnce({ _id: '1', content: 'apple' })
      .mockReturnValueOnce(null)
    mockStore.tagRepo.insert.mockReturnValueOnce({
      _id: '2',
      content: 'tomato',
    })
    mockStore.postRepo.insert.mockReturnValueOnce(expectedPost)
    mockStore.userRepo.save.mockReturnValueOnce({
      ...user,
      posts: [expectedPost._id],
    })
    postService.context.redis.ttl.mockReturnValueOnce(3000)

    // when
    const post = await postService.createPost(args)

    // then
    expect(post).toEqual(expectedPost)
    expect(mockStore.postRepo.insert).toHaveBeenLastCalledWith({
      author: user._id,
      title: args.postInput.title,
      body: args.postInput.body,
      tags: [
        { tagId: '1', content: 'apple' },
        { tagId: '2', content: 'tomato' },
      ],
    })
    expect(mockStore.userRepo.save).toHaveBeenLastCalledWith({
      ...user,
      posts: [expectedPost._id],
    })
  })

  it('Caches post and cleans up cache if cache is full', async () => {
    // given
    const args = {
      postInput: {
        title: 'New post',
        body: 'Hello world',
        image: '',
        tags: '',
      },
    }
    const user = { _id: '1', posts: [] }
    const expectedPost = {
      ...args.postInput,
      _id: '1',
      author: user._id,
      tags: [],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.insert.mockReturnValueOnce(expectedPost)
    mockStore.userRepo.save.mockReturnValueOnce({
      ...user,
      posts: [expectedPost._id],
    })
    postService.context.redis.lLen.mockReturnValueOnce(100)
    postService.context.redis.ttl.mockReturnValueOnce(-1)

    // when
    const post = await postService.createPost(args)

    // then
    expect(post).toEqual(expectedPost)
    expect(mockStore.postRepo.insert).toHaveBeenLastCalledWith({
      author: user._id,
      title: args.postInput.title,
      body: args.postInput.body,
    })
    expect(mockStore.userRepo.save).toHaveBeenLastCalledWith({
      ...user,
      posts: [expectedPost._id],
    })
    expect(postService.context.redis.rPop).toHaveBeenLastCalledWith(
      'cachedPosts'
    )
    expect(postService.context.redis.lPush).toHaveBeenLastCalledWith(
      'cachedPosts',
      JSON.stringify(expectedPost, fieldsOrder)
    )
    expect(postService.context.redis.expire).toHaveBeenLastCalledWith(
      'cachedPosts',
      60 * 60
    )
  })
})

describe('PostService.editPost', () => {
  it('Fails if title is empty', async () => {
    // given
    const args = {
      postInput: {
        title: '',
        body: 'Hello world',
        image: 'base64Image',
        tags: 'cat dog',
      },
    }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)

    await expect(async () => {
      await postService.createPost(args)
    }).rejects.toThrow('Title must not be empty')
  })

  it('Fails if body is empty', async () => {
    // given
    const args = {
      postInput: {
        title: 'New post',
        body: '',
        image: 'base64Image',
        tags: 'cat dog',
      },
    }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)

    // then
    await expect(async () => {
      await postService.createPost(args)
    }).rejects.toThrow('Body must not be empty')
  })

  it('Fails if post does not exist', async () => {
    // given
    const args = {
      postId: '1',
      postInput: {
        title: 'New title',
        body: 'New body',
      },
    }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(undefined)

    // then
    await expect(async () => {
      await postService.editPost(args)
    }).rejects.toThrow('Post does not exist')
  })

  it('Fails if user does not own post', async () => {
    // given
    const args = {
      postId: '1',
      postInput: {
        title: 'New title',
        body: 'New body',
        image: '',
        tags: 'apple tomato',
      },
    }
    const user = { _id: '1', posts: [{ _id: '3' }] }
    const oldPost = {
      _id: '1',
      author: '2',
      title: 'Old title',
      body: 'Old body',
      image: '',
      tags: [{ tagId: '3', content: 'lemon' }],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(oldPost)

    // then
    await expect(async () => {
      await postService.editPost(args)
    }).rejects.toThrow("You don't have permission to edit this post")
  })

  it('Attaches tag or creates one if tag does already not exist', async () => {
    // given
    const args = {
      postId: '1',
      postInput: {
        title: 'New title',
        body: 'New body',
        image: '',
        tags: 'apple tomato',
      },
    }
    const user = {
      _id: '1',
      username: 'john',
      email: 'john@example.com',
      posts: [{ _id: '1' }],
    }
    const oldPost = {
      _id: '1',
      author: user._id,
      title: 'Old title',
      body: 'Old body',
      image: '',
      tags: [{ tagId: '3', content: 'lemon' }],
    }
    const newPost = {
      ...oldPost,
      title: args.postInput.title,
      body: args.postInput.body,
      image: '',
      tags: [
        { tagId: '1', content: 'apple' },
        { tagId: '2', content: 'tomato' },
      ],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(oldPost)
    mockStore.tagRepo.findOne
      .mockReturnValueOnce({ _id: '1', content: 'apple' })
      .mockReturnValueOnce(null)
    mockStore.tagRepo.insert.mockReturnValueOnce({
      _id: '2',
      content: 'tomato',
    })
    postService.context.redis.lRange.mockReturnValueOnce([])

    // when
    const post = await postService.editPost(args)

    // then
    expect(mockStore.tagRepo.findOne).toHaveBeenNthCalledWith(1, {
      content: 'apple',
    })
    expect(mockStore.tagRepo.findOne).toHaveBeenNthCalledWith(2, {
      content: 'tomato',
    })
    expect(mockStore.tagRepo.insert).toHaveBeenLastCalledWith('tomato')
    expect(mockStore.postRepo.save).toHaveBeenLastCalledWith(newPost)
  })

  it('Uploads image to S3', async () => {
    // given
    const args = {
      postId: '1',
      postInput: {
        title: 'New title',
        body: 'New body',
        image: 'New_Image',
        tags: '',
      },
    }
    const user = { _id: '1', posts: [{ _id: '1' }] }
    const oldPost = {
      _id: '1',
      author: user._id,
      title: 'Old title',
      body: 'Old body',
      image: 'oldKey',
      tags: [],
    }
    const newPost = {
      ...oldPost,
      title: args.postInput.title,
      body: args.postInput.body,
      image: 'someKey',
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(oldPost)
    postService.context.redis.lRange.mockReturnValueOnce([])

    // when
    await postService.editPost(args)

    // then
    expect(imageFunctions.deleteImages).toHaveBeenLastCalledWith(['oldKey'])
    expect(mockStore.postRepo.save).toHaveBeenLastCalledWith(newPost)
  })

  it('Updates cache if post is cached', async () => {
    // given
    const args = {
      postId: '1',
      postInput: {
        title: 'New title',
        body: 'New body',
        image: '',
        tags: '',
      },
    }
    const user = { _id: '1', posts: [{ _id: '1' }] }
    const oldPost = {
      _id: '1',
      author: user._id,
      title: 'Old title',
      body: 'Old body',
      image: '',
      tags: [],
    }
    const newPost = {
      ...oldPost,
      title: args.postInput.title,
      body: args.postInput.body,
    }
    const cachedPosts = [
      {
        _id: '2',
        author: user._id,
        title: 'A post',
        body: 'Hello world',
        image: '',
        tags: [],
      },
      oldPost,
    ].map((post) => JSON.stringify(post, fieldsOrder))
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(oldPost)
    postService.context.redis.lRange.mockReturnValueOnce(cachedPosts)

    // when
    await postService.editPost(args)

    // then
    expect(postService.context.redis.lSet).toHaveBeenLastCalledWith(
      'cachedPosts',
      1,
      JSON.stringify(newPost, fieldsOrder)
    )
    expect(mockStore.postRepo.save).toHaveBeenLastCalledWith(newPost)
  })
})

describe('PostService.deletePost', () => {
  it('Fails if post does not exist', async () => {
    // given
    const postId = '1'
    const user = { _id: '1', posts: [] }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(undefined)

    // then
    await expect(async () => {
      await postService.deletePost(postId)
    }).rejects.toThrow('Post does not exist')
  })

  it('Fails if user does not own post', async () => {
    // given
    const postId = '1'
    const user = { _id: '1', posts: [{ _id: '2' }] }
    const post = {
      _id: '1',
      author: '3',
      image: '',
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(post)
    postService.context.redis.lRem.mockReturnValueOnce(0)

    // then
    await expect(async () => {
      await postService.deletePost(postId)
    }).rejects.toThrow("You don't have permission to delete this post")
  })

  it('Deletes image from S3', async () => {
    // given
    const postId = '1'
    const user = { _id: '1', posts: [{ _id: '1' }] }
    const post = {
      _id: '1',
      author: '1',
      image: 'someKey',
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(post)
    postService.context.redis.lRem.mockReturnValueOnce(0)

    // when
    await postService.deletePost(postId)

    // then
    expect(imageFunctions.deleteImages).toHaveBeenLastCalledWith([post.image])
  })
})

describe('PostService.createComment', () => {
  it('Fails if post does not exist', async () => {
    // given
    args = { postId: '1', body: 'New comment' }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(undefined)

    // then
    await expect(async () => {
      await postService.createComment(args)
    }).rejects.toThrow("Post doesn't exist")
  })

  it('Fails if comment body is empty', async () => {
    // given
    args = { postId: '1', body: '' }
    const post = { _id: '1', comments: [] }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(post)

    // then
    await expect(async () => {
      await postService.createComment(args)
    }).rejects.toThrow('Comment must not be empty')
  })

  it('Adds comment to post', async () => {
    // given
    args = { postId: '1', body: 'New comment' }
    const post = {
      _id: '1',
      comments: [
        { author: '3', body: 'A random comment' },
        { author: '2', body: 'Another random comment' },
      ],
    }
    const expectedPost = {
      _id: '1',
      comments: [
        { author: '3', body: 'A random comment' },
        { author: '2', body: 'Another random comment' },
        { author: '1', body: 'New comment' },
      ],
    }
    const user = { _id: '1' }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(post)

    // when
    await postService.createComment(args)

    // then
    expect(mockStore.postRepo.save).toHaveBeenLastCalledWith(expectedPost)
  })
})

describe('PostService.likePost', () => {
  it('Fails if post does not exist', async () => {
    // given
    args = { postId: '1' }
    const user = {
      _id: '1',
      posts: [],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(undefined)

    // then
    await expect(async () => {
      await postService.likePost(args)
    }).rejects.toThrow('Post does not exist')
  })

  it('Unlikes post if user already liked post', async () => {
    // given
    args = { postId: '1' }
    const post = {
      _id: '1',
      author: '2',
      likes: [{ _id: '1' }, { _id: '2' }],
    }
    const expectedPost = {
      _id: '1',
      author: '2',
      likes: [{ _id: '2' }],
    }
    const user = {
      _id: '1',
      posts: [],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(post)

    // when
    await postService.likePost(args)

    // then
    expect(mockStore.postRepo.save).toHaveBeenLastCalledWith(expectedPost)
  })

  it('Likes post if user has not liked it', async () => {
    // given
    args = { postId: '1' }
    const post = {
      _id: '1',
      author: '2',
      likes: [{ _id: '2' }],
    }
    const expectedPost = {
      _id: '1',
      author: '2',
      likes: [{ _id: '2' }, '1'],
    }
    const user = {
      _id: '1',
      posts: [],
    }
    mockStore.userRepo.findById.mockReturnValueOnce(user)
    mockStore.postRepo.findById.mockReturnValueOnce(post)

    // when
    await postService.likePost(args)

    // then
    expect(mockStore.postRepo.save).toHaveBeenLastCalledWith(expectedPost)
  })
})
