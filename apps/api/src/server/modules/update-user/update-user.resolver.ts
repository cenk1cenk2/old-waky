import { Args, Query, Resolver } from '@nestjs/graphql'

import { UpdateUserSchema } from './update-user.schema'

@Resolver('UpdateUser')
export class UpdateUserResolver {
  @Query(() => UpdateUserSchema)
  public hello(
    @Args({
      name: 'name',
      nullable: true,
      defaultValue: 'world'
    })
    name: string
  ): UpdateUserSchema {
    return { response: `Hello ${name}.` }
  }
}
