import { ForbiddenException, Inject, Logger } from '@nestjs/common'
import { Args, CONTEXT, Mutation, Resolver } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { OverrideValidationOptions } from '@webundsoehne/nestjs-util'
import * as bcrypt from 'bcryptjs'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { LoginInput } from './login.input'
import { LoginOutput } from './login.output'
import { UserEntity } from '@waky/api/entities/user.entity'
import { Events, WakyEventManager } from '@waky/api/interfaces'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'
import { EventManager, Public } from '@waky/nestjs-common'
@Public()
@Resolver(LoginOutput)
export class LoginResolver {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(CONTEXT) private readonly context: GraphQLContext,
    @Inject(EventManager) private readonly emitter: WakyEventManager,
    private jwtService: JwtService
  ) {}

  @OverrideValidationOptions({ groups: [ Events.USER_LOGIN ], validateCustomDecorators: false })
  @Mutation(() => LoginOutput)
  public async login (@Args() args: LoginInput): Promise<LoginOutput> {
    // get user from database
    const user = await this.userRepository.findOne({ username: args.username })

    // check if user in database exists and database password matches
    if (!(user && await bcrypt.compare(args.password, user.hash ?? ''))) {
      throw new ForbiddenException('Username or password does not match with any users.')
    }

    // create token
    const token = this.jwtService.sign({ id: user.id, key: uuidv4() })

    await this.emitter.emit(Events.USER_LOGIN, { req: this.context.req, token })

    // send user without has and the token back to the user
    return {
      token,
      username: user.username
    }
  }
}
