require('dotenv').config()
const connectToDB = require('./db/mongoose')
const setupApolloServer = require('./apolloServer')

const startServer = async () => {
  await connectToDB()
  await setupApolloServer()
}

startServer()

// const { ApolloServer } = require('apollo-server-express')
// const { gql } = require('apollo-server')
// const express = require('express')

// const typeDefs = gql`
//   type User {
//     id: ID!
//     token: String!
//     username: String!
//     email: String!
//     bio: String
//   }
//   type Query {
//     getUser(userId: ID!): User
//   }
//   type Mutation {
//     editBio(userId: ID!, bio: String!): User
//   }
// `

// const resolvers = {
//   Query: {
//     getUser: () => console.log('hello'),
//   },
// }

// const startServer = async () => {
//   const app = express()
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   })

//   await server.start()

//   server.applyMiddleware({ app })

//   app.listen({ port: process.env.PORT }, () => {
//     console.log(`Server is up on port ${process.env.PORT}`)
//   })
//   return server
// }
// startServer()
