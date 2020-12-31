import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetUserSessionsInput } from './user-session.input'
import { findPaginatedResult, PaginatedResult } from '@cenk1cenk2/nestjs-typeorm'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'
import { UserEntity } from '@waky/api/entities/user.entity'

@Injectable()
export class UserSessionService {
  constructor (
    @InjectRepository(UserSessionEntity) private readonly userSessionRepository: Repository<UserSessionEntity>
  ) {}

  public getUserSessions (
    user: UserEntity,
    { pagination }: GetUserSessionsInput
  ): Promise<PaginatedResult<UserSessionEntity>> {
    return findPaginatedResult(this.userSessionRepository, pagination, {
      where: { userId: user.id }
    })
  }
}
