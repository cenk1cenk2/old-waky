import { Field, ObjectType, PickType } from '@nestjs/graphql'

import { UserEntity } from '@waky/api/entities/user.entity'

@ObjectType()
export class LoginOutput extends PickType(UserEntity, [ 'username' ], ObjectType) {
  @Field({ nullable: false })
  token: string
}
