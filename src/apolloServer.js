require('dotenv').config()
const { ApolloServer } = require('apollo-server-express')
const { createServer } = require('http')
const express = require('express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { PubSub } = require('graphql-subscriptions')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { typeDefs, resolvers } = require('./graphql')
const store = require('./repositories')

const PostService = require('./services/PostService')
const TagService = require('./services/TagService')
const UserService = require('./services/UserService')
const ImageService = require('./services/ImageService')
const NotificationService = require('./services/NotificationService')
const pubsub = new PubSub()

const dataSources = () => ({
  postService: new PostService({ store }),
  tagService: new TagService({ store }),
  userService: new UserService({ store }),
  imageService: new ImageService({ store }),
  NotificationService: new NotificationService({ store }),
})

const setupApolloServer = async () => {
  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
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

  const httpServer = createServer(app)

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      context: ({ req, res }) => ({
        req,
        res,
        pubsub,
        dataSources: dataSources(),
      }),
    },
    wsServer
  )

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    dataSources,
    context: ({ req, res }) => ({
      req,
      res,
      pubsub,
    }),
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
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

  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
  })

  return server
}

module.exports = setupApolloServer
