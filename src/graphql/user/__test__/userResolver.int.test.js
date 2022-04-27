const {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} = require('@apollo/client/core')
const fetch = require('cross-fetch')

const { REGISTER, LOGIN } = require('./graphql')

const User = require('../../../models/User')
const connectToDB = require('../../../db/mongoose')

const httpLink = createHttpLink({
  uri: `http://localhost:${process.env.PORT}/graphql`,
  credentials: 'include',
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

beforeEach(async () => {
  await User.deleteMany()
})

describe('Register', () => {
  it('Registers successfully', async () => {
    const user = {
      username: 'james',
      email: 'james@example.com',
      password: '12345678',
    }
    const registerInput = { ...user }
    const result = await client.mutate({
      mutation: REGISTER,
      variables: { registerInput },
    })

    const resultUser = { ...result.data.register }

    expect(resultUser.username).toBe(user.username)
    expect(resultUser.email).toBe(user.email)
    expect(resultUser.createdAt).not.toBe(undefined)
    expect(resultUser.password).toBe(undefined)
  })

  it('Fails if email already exists', async () => {
    const user = {
      username: 'james',
      email: 'james@example.com',
      password: '12345678',
    }
    const registerInput = {
      ...user,
      username: 'jamie',
    }
    await new User(user).save()

    await expect(async () => {
      await client.mutate({
        mutation: REGISTER,
        variables: { registerInput },
      })
    }).rejects.toThrow('An account associated with this email already exists')
  })

  it('Fails if username already exists', async () => {
    const user = {
      username: 'james',
      email: 'james@example.com',
      password: '12345678',
    }
    const registerInput = {
      ...user,
      email: 'notjames@example.com',
    }
    await new User(user).save()

    await expect(async () => {
      await client.mutate({
        mutation: REGISTER,
        variables: { registerInput },
      })
    }).rejects.toThrow('Username already exists')
  })
})
