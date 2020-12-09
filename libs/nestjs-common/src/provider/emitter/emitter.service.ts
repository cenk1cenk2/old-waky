import { Injectable, Scope } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { EventRequest, EventResponse, EventDefinition } from './emitter.interface'

@Injectable({ scope: Scope.DEFAULT })
export class EventManager<
  Event extends string = string,
  Map extends Partial<Record<Event, EventDefinition>> = Partial<Record<Event, any>>
> {
  constructor (private readonly emitter: EventEmitter2) {}

  public async emit<MultipleResult extends boolean = false, E extends Event = Event>(
    dispatch: E,
    args: EventRequest<Event, Map>
  ): Promise<MultipleResult extends true ? EventResponse<Event, Map>[] : EventResponse<Event, Map>> {
    const response = await this.emitter.emitAsync(dispatch, args)

    return response.length === 1 ? response[0] : response
  }
}
