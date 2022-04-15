import { gql } from '@apollo/client'

//#region Queries
export const GET_ALL_POSTS = gql`
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
  }
`

export const GET_POST_BY_ID = gql`
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

export const FIND_POSTS_BY_TERM = gql`
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
  }
`

export const FIND_POSTS_BY_TAG = gql`
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

export const GET_USER_BY_ID = gql`
  query ($userId: ID!) {
    author: findUserById(userId: $userId) {
      id
      username
      bio
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
  }
`
//#endregion

//#region Mutations
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

export const UPDATE_BIO = gql`
  mutation ($userId: ID!, $bio: String!) {
    author: updateBio(userId: $userId, bio: $bio) {
      id
      username
      bio
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

export const EDIT_POST = gql`
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

export const LIKE_POST = gql`
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

export const CREATE_COMMENT = gql`
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

export const DELETE_POST = gql`
  mutation ($postId: ID!) {
    deletePost(postId: $postId)
  }
`

export const UPLOAD_IMAGE = gql`
  mutation ($image: String!) {
    image: insertImage(image: $image) {
      id
      url
    }
  }
`
//#endregion

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
  const postsData = cache.readQuery({ query: GET_ALL_POSTS })
  const { hasMore, last } = postsData.findAllPosts
  cache.writeQuery({
    query: GET_ALL_POSTS,
    data: {
      findAllPosts: {
        last,
        hasMore,
        posts: [post, ...postsData.findAllPosts.posts],
      },
    },
  })
  const tagsData = cache.readQuery({ query: GET_ALL_TAGS })
  const tagIds = new Set(tagsData.findAllTags.map((tag) => tag.id))
  cache.writeQuery({
    query: GET_ALL_TAGS,
    data: {
      findAllTags: [
        ...tagsData.findAllTags,
        ...post.tags.filter((tag) => !tagIds.has(tag.id)),
      ],
    },
  })
}

export const cacheUpdateDeletePost = (cache, payload, postId) => {
  const data = cache.readQuery({ query: GET_ALL_POSTS })
  const newPosts = data?.findAllPosts?.posts.filter(
    (post) => post.id !== postId
  )
  cache.writeQuery({
    query: GET_ALL_POSTS,
    data: {
      findAllPosts: {
        ...data?.findAllPosts,
        posts: newPosts,
      },
    },
  })
}
