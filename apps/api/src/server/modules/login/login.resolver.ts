import { ForbiddenException, Inject, InternalServerErrorException, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, CONTEXT, Query, Resolver } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { UserWithTokenDto } from './login.schema'
import { UserEntity } from '@waky/api/entities/user.entity'
import { Events } from '@waky/api/interfaces/emitter.interface'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'
import { emitter } from '@waky/api/util/emitter'
import { Public } from '@waky/nestjs-common'

@Public()
@Resolver(UserWithTokenDto)
export class LoginResolver {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(CONTEXT) private readonly context: GraphQLContext,
    private jwtService: JwtService,
    private readonly emitter: EventEmitter2
  ) {}

  @Query(() => UserWithTokenDto)
  public async login (
    @Args({ name: 'username' }) username: string,
      @Args({ name: 'password' }) password: string
  ): Promise<UserWithTokenDto> {
    // get user from database
    const user = await this.userRepository.findOne({ username })

    // check if user in database exists and database password matches
    if (!(user && await bcrypt.compare(password, user.hash ?? ''))) {
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
