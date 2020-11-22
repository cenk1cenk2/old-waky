import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity, UserWithPasswordDto } from '@waky/api/entities/user.entity'
import { TimeoutTaskDefaults } from '@waky/api/task/defaults/task.constants'
import { MaintenanceLocker } from '@webundsoehne/nestjs-util'
import { plainToClass } from 'class-transformer'
import { NestSchedule, Timeout, UseLocker } from 'nest-schedule'
import { Repository } from 'typeorm'

@Injectable()
export class DefaultUserTask extends NestSchedule {
  private readonly logger: Logger = new Logger(this.constructor.name)

  private defaultUser: UserWithPasswordDto = plainToClass(UserWithPasswordDto, {
    username: 'admin',
    password: 'admin',
    email: 'mock@admin.user',
    role: 'root'
  })

  constructor (@InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>) {
    super()
  }

  @Timeout(0, TimeoutTaskDefaults)
  @UseLocker(MaintenanceLocker)
  async createDefaultUser (): Promise<boolean> {
    try {
      const users = await this.repository.findAndCount()

      // if no users exists
      if (users[1] === 0) {
        await this.repository.save(this.defaultUser)
        this.logger.log(
          'No user has been found. An default user has been created with username: "admin", password: "admin".'
        )
        return true
      }

      return false
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}
