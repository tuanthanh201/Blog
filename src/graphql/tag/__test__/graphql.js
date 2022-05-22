const { gql } = require('apollo-server')

const GET_ALL_TAGS = gql`
  query {
    foundTags: findAllTags {
      id
      content
    }
  }
`

module.exports = { GET_ALL_TAGS }
