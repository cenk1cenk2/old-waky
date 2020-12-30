import { ObjectType } from '@nestjs/graphql'

import { Paginated } from '@cenk1cenk2/nestjs-graphql'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'

@ObjectType()
export class GetMachineSessionsOutput extends Paginated(MachineSessionEntity) {}
