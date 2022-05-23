const {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} = require('@apollo/client/core')
const fetch = require('cross-fetch')
const { arePostArraysEqual, arePostsEqual } = require('./utils')

const {
  GET_ALL_POSTS,
  FIND_POSTS_BY_TAG,
  FIND_POSTS_BY_TERM,
  GET_POST_BY_ID,
  LIKE_POST,
  CREATE_COMMENT,
  CREATE_POST,
  EDIT_POST,
  DELETE_POST,
} = require('./graphql')

const Post = require('../../../models/Post')
const User = require('../../../models/User')
const Tag = require('../../../models/Tag')
const connectToDB = require('../../../db/mongoose')

const httpLink = createHttpLink({
  uri: `http://localhost:4000/graphql`,
  fetch,
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {},
    },
  }),
})

let mongo
beforeAll(async () => {
  mongo = connectToDB()
})

afterAll(async () => {
  // need to run flushall on Redis too
  await mongo.connection.close()
})

let posts
let user
let tag
beforeEach(async () => {
  await Post.deleteMany()
  await User.deleteMany()
  await Tag.deleteMany()

  user = new User({
    email: 'admin@example.com',
    username: 'admin',
    password: '12345678',
  })
  await user.save()

  tag = new Tag({ content: 'tag' })
  await tag.save()

  posts = []
  for (let i = 0; i < 5; i++) {
    const post = new Post({
      author: user._id,
      title: `Post ${i + 1}`,
      body: `Post body ${i + 1}`,
      tags: i === 2 ? [{ tagId: tag.id, content: tag.content }] : [],
    })
    await post.save()
    posts.unshift(post)
  }
})

describe('Find all posts', () => {
  it('Finds all posts', async () => {
    const {
      data: {
        findAllPosts: { posts: postsFound },
      },
    } = await client.query({ query: GET_ALL_POSTS })
    expect(arePostArraysEqual(posts, postsFound))
  })
})

describe('Find posts by tag', () => {
  it('Finds post containing the tag', async () => {
    const {
      data: {
        findPostsByTag: { posts: postsFound },
      },
    } = await client.query({
      query: FIND_POSTS_BY_TAG,
      variables: { tag: 'tag' },
    })
    expect(postsFound.length).toBe(1)
    expect(postsFound[0].title).toBe('Post 3')
  })
})

describe('Find posts by term', () => {
  it('Finds posts containing the search term in titles', async () => {
    const {
      data: {
        findPostsByTerm: { posts: postsFound },
      },
    } = await client.query({
      query: FIND_POSTS_BY_TERM,
      variables: { term: 'post' },
    })
    expect(postsFound.length).toBe(5)
    expect(arePostArraysEqual(posts, postsFound))
  })
})

describe('Find post by id', () => {
  it('Finds post with id', async () => {
    const {
      data: { post },
    } = await client.query({
      query: GET_POST_BY_ID,
      variables: { postId: posts[0].id },
    })
    expect(post).not.toBeNull()
    expect(post.id.toString()).toBe(posts[0].id.toString())
  })
})
