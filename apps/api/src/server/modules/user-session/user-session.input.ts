import { ArgsType, PickType, IntersectionType } from '@nestjs/graphql'

import { PaginationArgs } from '@cenk1cenk2/nestjs-graphql'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'

@ArgsType()
export class GetUserSessionsInput extends PickType(
  IntersectionType(UserSessionEntity, PaginationArgs),
  [ 'pagination', 'userId' ],
  ArgsType
) {}
