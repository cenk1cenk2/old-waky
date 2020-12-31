import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BasicStringResult {
  @Field(() => String)
  result: string
}

@ObjectType()
export class BasicBooleanResult {
  @Field(() => Boolean)
  result: boolean
}
