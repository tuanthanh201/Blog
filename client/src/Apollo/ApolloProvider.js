import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'
import _ from 'lodash'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
})

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          findAllPosts: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing, incoming) {
              let posts
              if (existing?.posts) {
                posts = [...existing?.posts, ...incoming.posts]
              } else {
                posts = [...incoming.posts]
              }
              return {
                ...incoming,
                posts,
              }
            },
          },
          findPostsByTerm: {
            keyArgs: false,
            merge(existing, incoming) {
              let posts
              if (existing?.posts) {
                posts = [...existing?.posts, ...incoming.posts]
              } else {
                posts = [...incoming.posts]
              }
              return {
                ...incoming,
                posts,
              }
            },
          },
          findPostsByTag: {
            keyArgs: ['tag'],
            merge(existing, incoming) {
              let posts
              if (existing?.posts) {
                posts = _.cloneDeep(existing.posts)
              } else {
                posts = []
              }
              const postIds = existing?.posts.map((post) => post.__ref)
              const postsSet = new Set(postIds)
              for (const post of incoming.posts) {
                if (!postsSet.has(post.__ref)) {
                  posts.push(post)
                }
              }
              return {
                ...incoming,
                posts,
              }
            },
          },
        },
      },
    },
  }),
  link: httpLink,
})

const CustomApolloProvider = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default CustomApolloProvider
