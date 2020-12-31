import { Args, Query, Resolver } from '@nestjs/graphql'

import { GetUserSessionsInput } from './user-session.input'
import { GetUserSessionsOutput } from './user-session.output'
import { UserSessionService } from './user-session.service'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'
import { UserEntity } from '@waky/api/entities/user.entity'
import { CurrentUser } from '@waky/nestjs-common'

@Resolver(() => UserSessionEntity)
export class UserSessionResolver {
  constructor (private userSessionService: UserSessionService) {}

  @Query(() => GetUserSessionsOutput)
  public getUserSessions (
    @CurrentUser() user: UserEntity,
      @Args() args: GetUserSessionsInput
  ): Promise<GetUserSessionsOutput> {
    return this.userSessionService.getUserSessions(user, args)
  }
}
