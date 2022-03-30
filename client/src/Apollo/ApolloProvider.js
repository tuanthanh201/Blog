import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
})

const client = new ApolloClient({
  cache: new InMemoryCache({typePolicies: {
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
              posts
            }
          },
        },
        findPostsByTermSortNewest: {
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
              posts
            }
          },
        },
        findPostsByTermSortTrending: {
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
              posts
            }
          },
        },
        findPostsByTagSortNewest: {
          keyArgs: ['tag'],
          merge(existing, incoming) {
            let posts
            if (existing?.posts) {
              posts = [...existing?.posts, ...incoming.posts]
            } else {
              posts = [...incoming.posts]
            }
            return {
              ...incoming,
              posts
            }
          },
        },
        findPostsByTagSortTrending: {
          keyArgs: false,
          merge(existing, incoming) {
            console.log({existing, incoming})
            let posts
            if (existing?.posts) {
              posts = [...existing?.posts, ...incoming.posts]
            } else {
              posts = [...incoming.posts]
            }
            return {
              ...incoming,
              posts
            }
          },
        }
      }
    }}}),
  link: httpLink,
})

const CustomApolloProvider = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default CustomApolloProvider
