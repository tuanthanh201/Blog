require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { typeDefs, resolvers } = require('./graphql')
const store = require('./repositories')

const PostService = require('./services/PostService')
const TagService = require('./services/TagService')
const UserService = require('./services/UserService')
const ImageService = require('./services/ImageService')

const dataSources = () => ({
  postService: new PostService({ store }),
  tagService: new TagService({ store }),
  userService: new UserService({ store }),
  imageService: new ImageService({ store }),
})

const setupApolloServer = async () => {
  const app = express()

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
        httpOnly: false,
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

  app.listen({ port: process.env.PORT }, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
  })
  return server
}

module.exports = setupApolloServer