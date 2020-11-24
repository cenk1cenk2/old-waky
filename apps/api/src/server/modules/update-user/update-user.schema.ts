import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UpdateUserSchema {
  @Field({ nullable: true })
  response: string
}
