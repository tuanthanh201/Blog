const { gql } = require('apollo-server')

const typeDefs = gql`
  type Post {
    id: ID!
    author: User!
    title: String!
    body: String!
    image: String
    likes: [User]!
    likeCount: Int!
    comments: [Comment]!
    commentCount: Int!
    tags: [Tag]!
    createdAt: String!
  }
  type Comment {
    id: ID!
    author: User!
    body: String!
    createdAt: String!
  }
  extend type Query {
    getPost(postId: ID!): Post
    getPosts: [Post]
  }
  extend type Mutation {
    editPost(postId: ID!, body: String!): Post!
    deletePost(postId: ID!): String!
    addTag(postId: ID!, tag: String!): Post!
    removeTag(postId: ID!, tagId: ID!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`

module.exports = typeDefs
