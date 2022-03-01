const { gql } = require('apollo-server')

const typeDefs = gql`
  type Tag {
    id: ID!
    content: String!
    createdAt: String!
  }
  extend type Query {
    getTagByContent(content: String!): Tag
    getTagById(tagId: ID!): Tag
    getTags: [Tag]
  }
  extend type Mutation {
    createTag(content: String!): Tag!
  }
`

module.exports = typeDefs
