require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { gql } = require('apollo-server')
const jwt = require('jsonwebtoken')

// const postTypeDefs = require('./graphql/post/typeDefs')
// const userTypeDefs = require('./graphql/user/typeDefs')
// const tagTypeDefs = require('./graphql/tag/typeDefs')

// const postResolvers = require('./graphql/post/resolvers')
// const userResolvers = require('./graphql/user/resolvers')
// const tagResolvers = require('./graphql/tag/resolvers')

const { typeDefs, resolvers } = require('./graphql')


const setupApolloServer = async () => {
  const app = express()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await server.start()
  server.applyMiddleware({ app })

  app.listen({ port: process.env.PORT }, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
  })
  return server
}

module.exports = setupApolloServer
