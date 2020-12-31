import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GetMachineSessionsInput, RevokeTokenInput, UpdateTokenInput } from './machine-session.input'
import { GetMachineSessionsOutput, RevokeTokenOutput, UpdateTokenOutput } from './machine-session.output'
import { MachineSessionService } from './machine-session.service'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'
import { UserEntity } from '@waky/api/entities/user.entity'
import { CurrentUser } from '@waky/nestjs-common'

@Resolver(() => MachineSessionEntity)
export class MachineSessionResolver {
  constructor (private userSessionService: MachineSessionService) {}

  @Query(() => GetMachineSessionsOutput, { description: 'Get all API tokens defined.' })
  public getMachineSessions (
    @CurrentUser() user: UserEntity,
      @Args() args: GetMachineSessionsInput
  ): Promise<GetMachineSessionsOutput> {
    return this.userSessionService.getMachineSessions(user, args)
  }

  @Mutation(() => RevokeTokenOutput, { description: 'Revoke a set of API tokens that belongs to the user.' })
  public revokeToken (@CurrentUser() user: UserEntity, @Args() args: RevokeTokenInput): Promise<RevokeTokenOutput> {
    return this.userSessionService.revokeToken(user, args)
  }

  @Mutation(() => UpdateTokenOutput, { description: 'Update session token data that belongs to a user.' })
  public updateToken (@CurrentUser() user: UserEntity, @Args() args: UpdateTokenInput): Promise<UpdateTokenOutput> {
    return this.userSessionService.updateToken(user, args)
  }
}
