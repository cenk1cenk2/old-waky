import { gql } from '@apollo/client'
import { DocumentNode } from 'graphql'

export enum ClientQuery {
  USER_LOGIN
}

export const ClientQueryMap: Record<ClientQuery, DocumentNode> = {
  [ClientQuery.USER_LOGIN]: gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
      }
    }
  `
}
