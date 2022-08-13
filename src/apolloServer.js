const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { createClient } = require('redis')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { typeDefs, resolvers } = require('./graphql')
const store = require('./repositories')

const PostService = require('./services/PostService')
const TagService = require('./services/TagService')
const UserService = require('./services/UserService')
const ImageService = require('./services/ImageService')
const RateLimitService = require('./services/RateLimitService')

const PostLoader = require('./graphql/loaders/PostLoader')
const UserLoader = require('./graphql/loaders/UserLoader')

const dataSources = () => ({
  postService: new PostService({ store }),
  tagService: new TagService({ store }),
  userService: new UserService({ store }),
  imageService: new ImageService({ store }),
  rateLimitService: new RateLimitService({ store }),
})

const setupApolloServer = async () => {
  const app = express()
  let redis
  if (process.env.STATUS == 'PRODUCTION') {
    redis = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    })
    redis.on('connect', () => console.log('Connected to Redis'))
    await redis.connect()
  }

  app.use(cookieParser())

  app.use((req, res, next) => {
    try {
      const { token } = req.cookies
      if (token) {
        const parsedToken = jwt.verify(token, process.env.JSON_SECRET)
        req.parsedToken = parsedToken
      }
    } catch (error) {
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(0),
      })
    }
    next()
  })

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      postLoader: PostLoader(dataSources().postService),
      userLoader: UserLoader(dataSources().userService),
    }),
  })

  await server.start()
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      credentials: true,
      origin: process.env.FRONT_END_URL,
    },
    bodyParserConfig: {
      limit: '50mb',
    },
  })

  return app.listen({ port: process.env.PORT }, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
  })
}

module.exports = setupApolloServer
