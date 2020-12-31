import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@webundsoehne/nestjs-util'
import { Interval, NestSchedule } from 'nest-schedule'
import { Repository } from 'typeorm'

import { UserSessionEntity } from '@waky/api/entities/user-session.entity'
import { IntervalTaskDefaults } from '@waky/api/task/defaults/task.constants'

@Injectable()
export class SessionCleanupTask extends NestSchedule {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserSessionEntity) private readonly userSessionRepository: Repository<UserSessionEntity>
  ) {
    super()
  }

  @Interval(ConfigService.get('token.session-cleanup') * 60000, IntervalTaskDefaults)
  public async executeSessionCleanup (): Promise<void> {
    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .delete()
        .where('(userSessions.exp * 1000) < :now', { now: Date.now() })
        .execute()

      if (result?.affected > 0) {
        this.logger.verbose(`Cleaned up expired ${result.affected} sessions.`)
      }
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}
