import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SessionCleanupTask } from './session-cleanup.task'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ UserSessionEntity ]) ],
  providers: [ SessionCleanupTask ],
  exports: [ SessionCleanupTask ]
})
export class SessionCleanupTaskModule {}
