import { Field, ObjectType } from '@nestjs/graphql'

import { UserEntity } from '@waky/api/entities/user.entity'

@ObjectType()
export class LoginOutput {
  @Field(() => String, { nullable: false })
  token: string

  @Field(() => UserEntity)
  user: UserEntity
}
