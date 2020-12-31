import { ObjectType } from '@nestjs/graphql'

import { Paginated } from '@cenk1cenk2/nestjs-graphql'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'
import { BasicStringResult } from '@waky/api/interfaces'

@ObjectType()
export class GetMachineSessionsOutput extends Paginated(MachineSessionEntity) {}

@ObjectType()
export class RevokeTokenOutput extends BasicStringResult {}

@ObjectType()
export class UpdateTokenOutput extends BasicStringResult {}
