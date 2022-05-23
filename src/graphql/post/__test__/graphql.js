const { gql } = require('apollo-server')

const GET_ALL_POSTS = gql`
  query ($cursor: ID) {
    findAllPosts(cursor: $cursor) {
      hasMore
      last
      posts {
        id
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
        createdAt
      }
    }
  }
`

const GET_POST_BY_ID = gql`
  query ($postId: ID!) {
    post: findPostById(postId: $postId) {
      id
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
      likes {
        id
      }
      commentCount
      comments {
        id
        author {
          id
          username
        }
        body
        createdAt
      }
      createdAt
    }
  }
`

const FIND_POSTS_BY_TERM = gql`
  query ($term: String!, $cursor: ID) {
    findPostsByTerm(term: $term, cursor: $cursor) {
      hasMore
      last
      posts {
        id
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
        createdAt
      }
    }
  }
`

const FIND_POSTS_BY_TAG = gql`
  query ($tag: String!, $cursor: ID) {
    findPostsByTag(tag: $tag, cursor: $cursor) {
      hasMore
      last
      posts {
        id
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
        createdAt
      }
    }
  }
`

const CREATE_POST = gql`
  mutation ($postInput: PostInput!) {
    post: createPost(postInput: $postInput) {
      id
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
      createdAt
    }
  }
`

const EDIT_POST = gql`
  mutation ($postId: ID!, $postInput: PostInput!) {
    editPost(postId: $postId, postInput: $postInput) {
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

const LIKE_POST = gql`
  mutation ($postId: ID!) {
    post: likePost(postId: $postId) {
      id
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
      likes {
        id
      }
      commentCount
      comments {
        id
        author {
          id
          username
        }
        body
        createdAt
      }
      createdAt
    }
  }
`

const CREATE_COMMENT = gql`
  mutation ($postId: ID!, $body: String!) {
    post: createComment(postId: $postId, body: $body) {
      id
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
      likes {
        id
      }
      commentCount
      comments {
        id
        author {
          id
          username
        }
        body
        createdAt
      }
      createdAt
    }
  }
`

const DELETE_POST = gql`
  mutation ($postId: ID!) {
    deletePost(postId: $postId)
  }
`

module.exports = {
  GET_ALL_POSTS,
  FIND_POSTS_BY_TAG,
  FIND_POSTS_BY_TERM,
  GET_POST_BY_ID,
  LIKE_POST,
  CREATE_COMMENT,
  CREATE_POST,
  EDIT_POST,
  DELETE_POST,
}
