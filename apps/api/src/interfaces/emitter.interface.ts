import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'

export enum Events {
  USER_LOGIN = 'user_login'
}

export declare class EventTypes implements Record<Events, { response: any, request: any }> {
  [Events.USER_LOGIN]: { request: { req: GraphQLContext['req'], token: string }, response: void }
}
