import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserSessionResolver } from './user-session.resolver'
import { UserSessionService } from './user-session.service'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ UserSessionEntity ]) ],
  providers: [ UserSessionService, UserSessionResolver ]
})
export class UserSessionModule {}
