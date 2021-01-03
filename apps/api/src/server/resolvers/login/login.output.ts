import { Field, ObjectType } from '@nestjs/graphql'

import { UserEntity } from '@waky/api/entities/user.entity'
import { BasicBooleanResult } from '@waky/api/interfaces'

@ObjectType()
export class CheckAuthenticationOutput extends BasicBooleanResult {}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  token: string

  @Field(() => UserEntity)
  user: UserEntity
}

@ObjectType()
export class CreateTokenOutput {
  @Field(() => String)
  token: string
}
