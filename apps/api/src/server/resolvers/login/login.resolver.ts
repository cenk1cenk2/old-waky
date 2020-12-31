import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CreateTokenInput, LoginInput } from './login.input'
import { CreateTokenOutput, LoginOutput } from './login.output'
import { LoginService } from './login.service'
import { Public } from '@cenk1cenk2/nestjs-utils'
import { UserEntity } from '@waky/api/entities/user.entity'
import { CurrentUser } from '@waky/nestjs-common'

@Resolver(() => LoginOutput)
export class LoginResolver {
  constructor (private loginService: LoginService) {}

  @Public()
  @Mutation(() => LoginOutput)
  public async login (@Args() args: LoginInput): Promise<LoginOutput> {
    return this.loginService.login(args)
  }

  @Mutation(() => CreateTokenOutput)
  public async createToken (
    @CurrentUser() user: UserEntity,
      @Args() args: CreateTokenInput
  ): Promise<CreateTokenOutput> {
    return this.loginService.createToken(user, args)
  }
}
