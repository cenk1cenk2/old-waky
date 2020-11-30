import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: CONFIG.api.url,
  cache: new InMemoryCache()
})
