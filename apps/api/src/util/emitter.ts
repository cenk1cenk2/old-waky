import { EventEmitter2 } from '@nestjs/event-emitter'

import { Events, EventTypes } from '@waky/api/interfaces/emitter.interface'

export async function emitter<E extends Events = any> (
  e: EventEmitter2,
  dispatch: E,
  args: EventTypes[E]['request']
): Promise<EventTypes[E]['response']> {
  const response = await e.emitAsync(dispatch, args)

  if (response.length === 1) {
    return response[0]
  } else {
    return (response as unknown) as EventTypes[E]['response']
  }
}
