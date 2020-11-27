import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SessionHandler } from './session.handler'
import { SessionEntity } from '@waky/api/entities/session.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ SessionEntity ]) ],
  providers: [ SessionHandler ]
})
export class SessionModule {}
