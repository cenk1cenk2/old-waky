import { ForbiddenException, Inject, InternalServerErrorException, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, CONTEXT, Mutation, Resolver } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { LoginInput } from './login.input'
import { LoginOutput } from './login.output'
import { UserEntity } from '@waky/api/entities/user.entity'
import { Events } from '@waky/api/interfaces/emitter.interface'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'
import { emitter } from '@waky/api/util/emitter'
import { Public } from '@waky/nestjs-common'

@Public()
@Resolver(LoginOutput)
export class LoginResolver {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(CONTEXT) private readonly context: GraphQLContext,
    private jwtService: JwtService,
    private readonly emitter: EventEmitter2
  ) {}

  @Mutation(() => LoginOutput)
  public async login (@Args() args: LoginInput): Promise<LoginOutput> {
    // get user from database
    const user = await this.userRepository.findOneOrFail({ username: args.username })

    // check if user in database exists and database password matches
    if (!(user && await bcrypt.compare(args.password, user.hash ?? ''))) {
      throw new ForbiddenException('Username or password does not match with any users.')
    }

    // create token
    const token = this.jwtService.sign({ id: user.id, key: uuidv4() })

    try {
      await emitter(this.emitter, Events.USER_LOGIN, { req: this.context.req, token })
    } catch (e) {
      throw new InternalServerErrorException(
        `There was an error while creating a session for user. Please try again later. ${e}`
      )
    }

    // send user without has and the token back to the user
    return {
      token,
      username: user.username
    }
  }
}
