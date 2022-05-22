const {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} = require('@apollo/client/core')
const fetch = require('cross-fetch')

const { GET_ALL_TAGS } = require('./graphql')

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
  mongo = await connectToDB()
})

afterAll(async () => {
  await mongo.connection.close()
})

let tags
beforeEach(async () => {
  await Tag.deleteMany()

  tags = []
  for (let i = 0; i < 5; i++) {
    const tag = new Tag({ content: `Tag ${i + 1}` })
    await tag.save()
    tags.push(tag)
  }
})

describe('Finds all tags', () => {
  it('Finds all tags', async () => {
    const {
      data: { foundTags },
    } = await client.query({ query: GET_ALL_TAGS })
    expect(foundTags.length).toBe(5)
  })
})
