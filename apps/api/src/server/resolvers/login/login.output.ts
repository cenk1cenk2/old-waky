import { Field, ObjectType } from '@nestjs/graphql'

import { UserEntity } from '@waky/api/entities/user.entity'

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
