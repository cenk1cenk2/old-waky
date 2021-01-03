import { ApolloClient, InMemoryCache } from '@apollo/client'
import { LocalStorage } from '@waky/frontend/interfaces'

export const client = new ApolloClient({
  uri: CONFIG.api.url,
  cache: new InMemoryCache(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  headers: { Authorization: 'Bearer ' + localStorage.getItem(LocalStorage.TOKEN) }
})
