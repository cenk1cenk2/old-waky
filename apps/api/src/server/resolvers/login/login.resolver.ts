import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CheckAuthenticationInput, CreateTokenInput, LoginInput } from './login.input'
import { CheckAuthenticationOutput, CreateTokenOutput, LoginOutput } from './login.output'
import { LoginService } from './login.service'
import { Public } from '@cenk1cenk2/nestjs-utils'
import { UserEntity } from '@waky/api/entities/user.entity'
import { CurrentUser } from '@waky/nestjs-common'

@Resolver(() => LoginOutput)
export class LoginResolver {
  constructor (private loginService: LoginService) {}

  @Public()
  @Query(() => CheckAuthenticationOutput, { description: 'Check if current token is still valid.' })
  public async checkAuthentication (@Args() args: CheckAuthenticationInput): Promise<CheckAuthenticationOutput> {
    return this.loginService.checkAuthentication(args)
  }

  @Public()
  @Mutation(() => LoginOutput, { description: 'Login with username and password to get the JWT token.' })
  public async login (@Args() args: LoginInput): Promise<LoginOutput> {
    return this.loginService.login(args)
  }

  @Mutation(() => CreateTokenOutput, { description: 'Create an API token to use in automated requests.' })
  public async createToken (
    @CurrentUser() user: UserEntity,
      @Args() args: CreateTokenInput
  ): Promise<CreateTokenOutput> {
    return this.loginService.createToken(user, args)
  }
}
