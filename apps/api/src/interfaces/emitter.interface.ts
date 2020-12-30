import { DecodedToken } from './decoded-token.interface'
import { Events } from './events.interface'
import { GraphQLContext } from './graphql-context.interface'
import { EventMap, EventRequest, EventResponse, EventManager, BaseEventMap } from '@cenk1cenk2/nestjs-emitter'
import { UserEntity } from '@waky/api/entities/user.entity'

/**
 * Request-response maps of events.
 */
export declare class WakyEventMap extends BaseEventMap implements EventMap<Events> {
  [Events.USER_LOGIN]: {
    request: { req: GraphQLContext['req'], token: string }
  };
  [Events.CREATE_MACHINE_SESSION]: {
    request: { token: string }
  };
  [Events.SESSION_VERIFY]: {
    request: DecodedToken
    response: UserEntity
  }
}

export type WakyEventRequest<E extends Events> = EventRequest<E, WakyEventMap>

export type WakyEventResponse<E extends Events> = EventResponse<E, WakyEventMap>

export type WakyEventManager = EventManager<Events, WakyEventMap>
