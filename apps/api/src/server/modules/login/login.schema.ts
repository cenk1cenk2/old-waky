import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserWithTokenDto {
  @Field({ nullable: false })
  username: string

  @Field({ nullable: false })
  token: string
}
