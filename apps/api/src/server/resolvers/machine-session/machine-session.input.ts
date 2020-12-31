import { ArgsType, Field, IntersectionType, PickType } from '@nestjs/graphql'

import { PaginationArgs } from '@cenk1cenk2/nestjs-graphql'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'

@ArgsType()
export class GetMachineSessionsInput extends PickType(
  IntersectionType(MachineSessionEntity, PaginationArgs),
  [ 'pagination' ],
  ArgsType
) {}

@ArgsType()
export class RevokeTokenInput {
  @Field(() => [ String ])
  id: string[]
}

@ArgsType()
export class UpdateTokenInput extends PickType(MachineSessionEntity, [ 'id', 'description' ]) {}
