import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'
import { FastifyRequest } from 'fastify'

export enum Events {
  USER_LOGIN = 'user_login'
}

export interface EventTypes {
  [Events.USER_LOGIN]: (req: GraphQLContext['req'], token: string) => void
}
