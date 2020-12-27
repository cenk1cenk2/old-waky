import { ObjectType } from '@nestjs/graphql'

import { Paginated } from '@cenk1cenk2/nestjs-graphql'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'

@ObjectType()
export class GetUserSessionsOutput extends Paginated(UserSessionEntity) {}
