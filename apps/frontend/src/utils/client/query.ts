import { gql } from '@apollo/client'
import { DocumentNode } from 'graphql'

export enum ClientQuery {
  USER_LOGIN,
  AUTHENTICATION_CHECK
}

export const ClientQueryMap: Record<ClientQuery, DocumentNode> = {
  [ClientQuery.USER_LOGIN]: gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
      }
    }
  `,
  [ClientQuery.AUTHENTICATION_CHECK]: gql`
    query CheckAuthentication($token: String!) {
      checkAuthentication(token: $token) {
        result
      }
    }
  `
}
