import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query {
    posts: findAllPosts {
      id
      author {
        id
        username
      }
      image
      title
      body
      tags {
        id
        content
      }
      createdAt
    }
  }
`

export const GET_POST_BY_ID = gql`
  query ($postId: ID!) {
    post: findPostById(postId: $postId) {
      author {
        id
        username
      }
      title
      body
      image
      tags {
        id
        content
      }
      likeCount
      commentCount
      comments {
        id
        author {
          id
          username
        }
        body
      }
    }
  }
`

export const GET_ALL_TAGS = gql`
  query {
    findAllTags {
      id
      content
    }
  }
`

export const GET_ME = gql`
  query {
    getMe {
      id
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

export const LOGIN = gql`
  mutation ($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      id
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

export const REGISTER = gql`
  mutation ($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      id
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

export const LOGOUT = gql`
  mutation {
    logout
  }
`

export const CREATE_POST = gql`
  mutation ($postInput: PostInput!) {
    post: createPost(postInput: $postInput) {
      id
      author {
        id
        username
      }
      image
      title
      body
      tags {
        id
        content
      }
      createdAt
    }
  }
`

export const cacheUpdateLogin = (cache, payload) => {
  const user = payload?.data?.login
  if (!user) return
  cache.writeQuery({
    query: GET_ME,
    data: {
      getMe: user,
    },
  })
}

export const cacheUpdateRegister = (cache, payload) => {
  const user = payload?.data?.register
  if (!user) return
  cache.writeQuery({
    query: GET_ME,
    data: {
      getMe: user,
    },
  })
}

export const cacheUpdateLogout = (cache, payload) => {
  cache.writeQuery({
    query: GET_ME,
    data: {
      getMe: null,
    },
  })
}

export const cacheUpdateCreatePost = (cache, payload) => {
  const post = payload?.data?.post
  const data = cache.readQuery({ query: GET_ALL_POSTS })
  cache.writeQuery({
    query: GET_ALL_POSTS,
    data: {
      posts: [post, ...data.posts],
    },
  })
}
