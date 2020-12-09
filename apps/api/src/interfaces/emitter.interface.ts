import { Events } from './events.interface'
import { GraphQLContext } from './graphql-context.interface'
import { EventMap, EventRequest, EventResponse, EventManager } from '@waky/nestjs-common'

/**
 * Request-response maps of events.
 */
export declare class WakyEventMap implements EventMap<Events> {
  [Events.USER_LOGIN]: {
    request: { req: GraphQLContext['req'], token: string }
  }
}

export type WakyEventRequest<E extends Events> = EventRequest<E, WakyEventMap>

export type WakyEventResponse<E extends Events> = EventResponse<E, WakyEventMap>

export type WakyEventManager = EventManager<Events, WakyEventMap>
