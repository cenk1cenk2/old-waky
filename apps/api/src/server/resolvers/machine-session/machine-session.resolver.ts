import { Args, Query, Resolver } from '@nestjs/graphql'

import { GetMachineSessionsInput } from './machine-session.input'
import { GetMachineSessionsOutput } from './machine-session.output'
import { MachineSessionService } from './machine-session.service'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'

@Resolver(() => MachineSessionEntity)
export class MachineSessionResolver {
  constructor (private userSessionService: MachineSessionService) {}

  @Query(() => GetMachineSessionsOutput)
  public getMachineSessions (@Args() args: GetMachineSessionsInput): Promise<GetMachineSessionsOutput> {
    return this.userSessionService.getMachineSessions(args)
  }
}
