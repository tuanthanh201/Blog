const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    id: ID!
    token: String!
    username: String!
    email: String!
    bio: String
  }
  extend type Query {
    getUser(userId: ID!): User
  }
  extend type Mutation {
    editBio(userId: ID!, bio: String!): User
  }
`

module.exports = typeDefs
