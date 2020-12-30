import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SessionHandler } from './session.handler'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'
import { UserEntity } from '@waky/api/entities/user.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity, UserSessionEntity, MachineSessionEntity ]) ],
  providers: [ SessionHandler ]
})
export class SessionModule {}
