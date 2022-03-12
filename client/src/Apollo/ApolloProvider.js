import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'

const uri = 'http://localhost:4000/graphql'

const httpLink = createHttpLink({
  uri,
  credentials: 'include',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // link: link.concat(httpLink),
  link: httpLink
})

export default function ({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
