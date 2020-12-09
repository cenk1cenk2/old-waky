/**
 * A definition of a event with response-request map.
 */
export interface EventDefinition {
  response?: any
  request?: any
}

/**
 * Request type of an event.
 */
export type EventRequest<Event extends string, Map extends Record<Event, EventDefinition>> = Event extends keyof Map
  ? 'request' extends keyof Map[Event]
    ? Map[Event]['request']
    : void
  : never

/**
 * Response type of an event.
 */
export type EventResponse<Event extends string, Map extends Record<Event, EventDefinition>> = Event extends keyof Map
  ? 'response' extends keyof Map[Event]
    ? Map[Event]['response']
    : void
  : never

/**
 * For fast typing the event map.
 */
export type EventMap<Events extends string> = Partial<Record<Events, EventDefinition>>
