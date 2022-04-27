const { gql } = require('apollo-server')

const REGISTER = gql`
  mutation ($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      username
      email
      bio
      posts {
        title
        body
      }
      createdAt
    }
  }
`

const LOGIN = gql`
  mutation ($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      username
      email
      bio
      posts {
        title
        body
      }
      createdAt
    }
  }
`

module.exports = { REGISTER, LOGIN }
