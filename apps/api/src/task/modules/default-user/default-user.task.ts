import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigParam, Configurable, MaintenanceLocker } from '@webundsoehne/nestjs-util'
import { plainToClass } from 'class-transformer'
import { NestSchedule, Timeout, UseLocker } from 'nest-schedule'
import { Repository } from 'typeorm'

import { UserEntity } from '@waky/api/entities/user.entity'
import { TimeoutTaskDefaults } from '@waky/api/task/defaults/task.constants'

@Injectable()
export class DefaultUserTask extends NestSchedule {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor (@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
    super()
  }

  @Timeout(0, TimeoutTaskDefaults)
  @UseLocker(MaintenanceLocker)
  @Configurable()
  public async createDefaultUser (
    @ConfigParam('defaults.username') username: string,
      @ConfigParam('defaults.password') password: string
  ): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [ users, userCount ] = await this.userRepository.findAndCount()

      // if no users exists
      if (userCount === 0) {
        this.logger.log(
          'No user has been found. An default user has been created with username: "admin", password: "admin".'
        )

        const user = plainToClass(
          UserEntity,
          new UserEntity({
            username,
            password
          })
        )

        await this.userRepository.save(user)

        return true
      }

      return false
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}
