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
  cache: new InMemoryCache(),
  link: httpLink,
})

const CustomApolloProvider = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default CustomApolloProvider
