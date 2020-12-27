import { Inject, Logger } from '@nestjs/common'
import { Args, CONTEXT, Mutation, Resolver } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { LoginInput } from './login.input'
import { LoginOutput } from './login.output'
import { LoginService } from './login.service'
import { EventManager } from '@cenk1cenk2/nestjs-emitter'
import { Public } from '@cenk1cenk2/nestjs-utils'
import { UserEntity } from '@waky/api/entities/user.entity'
import { WakyEventManager } from '@waky/api/interfaces/emitter.interface'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'

@Public()
@Resolver(() => LoginOutput)
export class LoginResolver {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(CONTEXT) private readonly context: GraphQLContext,
    @Inject(EventManager) private readonly emitter: WakyEventManager,
    private loginService: LoginService
  ) {}

  @Mutation(() => LoginOutput)
  public async login (@Args() args: LoginInput): Promise<LoginOutput> {
    return this.loginService.login(args)
  }
}
