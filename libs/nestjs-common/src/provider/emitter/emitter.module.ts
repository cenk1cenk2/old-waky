import { Global, Module } from '@nestjs/common'

import { EventManager } from './emitter.service'

@Global()
@Module({
  providers: [ EventManager ],
  exports: [ EventManager ]
})
export class EmitterModule {}
