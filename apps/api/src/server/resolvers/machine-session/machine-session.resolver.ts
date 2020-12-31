import { Args, Query, Resolver } from '@nestjs/graphql'

import { GetMachineSessionsInput } from './machine-session.input'
import { GetMachineSessionsOutput } from './machine-session.output'
import { MachineSessionService } from './machine-session.service'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'
import { UserEntity } from '@waky/api/entities/user.entity'
import { CurrentUser } from '@waky/nestjs-common'

@Resolver(() => MachineSessionEntity)
export class MachineSessionResolver {
  constructor (private userSessionService: MachineSessionService) {}

  @Query(() => GetMachineSessionsOutput)
  public getMachineSessions (
    @CurrentUser() user: UserEntity,
      @Args() args: GetMachineSessionsInput
  ): Promise<GetMachineSessionsOutput> {
    return this.userSessionService.getMachineSessions(user, args)
  }
}
