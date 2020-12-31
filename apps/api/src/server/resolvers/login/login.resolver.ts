import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { LoginInput } from './login.input'
import { LoginOutput } from './login.output'
import { LoginService } from './login.service'
import { Public } from '@cenk1cenk2/nestjs-utils'

@Resolver(() => LoginOutput)
export class LoginResolver {
  constructor (private loginService: LoginService) {}

  @Public()
  @Mutation(() => LoginOutput)
  public async login (@Args() args: LoginInput): Promise<LoginOutput> {
    return this.loginService.login(args)
  }
}
