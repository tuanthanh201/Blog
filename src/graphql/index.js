const _ = require('lodash')
const { gql } = require('apollo-server')

const postTypeDefs = require('./post/typeDefs')
const userTypeDefs = require('./user/typeDefs')
const tagTypeDefs = require('./tag/typeDefs')

const postResolvers = require('./post/resolvers')
const userResolvers = require('./user/resolvers')
const tagResolvers = require('./tag/resolvers')

const baseTypeDefs = gql`
  type Query
  type Mutation
`

const typeDefs = [baseTypeDefs, postTypeDefs, userTypeDefs, tagTypeDefs]
const resolvers = _.merge({}, postResolvers, userResolvers, tagResolvers)

module.exports = {
  typeDefs,
  resolvers,
}
