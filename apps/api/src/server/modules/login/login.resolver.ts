import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'
import { ForbiddenException, Inject, InternalServerErrorException, Logger } from '@nestjs/common'
import { Args, CONTEXT, GraphQLExecutionContext, Query, Resolver } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@waky/api/entities/user.entity'
import { Events, EventTypes } from '@waky/api/interfaces/emitter.interface'
import { Public } from '@waky/nestjs-common'
import * as bcrypt from 'bcryptjs'
import { NestEventEmitter } from 'nest-event'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { UserWithTokenDto } from './login.schema'

@Public()
@Resolver(UserWithTokenDto)
export class LoginResolver {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(CONTEXT) private readonly context: GraphQLContext,
    private jwtService: JwtService,
    private readonly emitter: NestEventEmitter
  ) {}

  @Query(() => UserWithTokenDto)
  public async login(
    @Args({ name: 'username' }) username: string,
    @Args({ name: 'password' }) password: string
  ): Promise<UserWithTokenDto> {
    // get user from database
    const user = await this.userRepository.findOne({ username })

    // check if user in database exists and database password matches
    if (!(user && (await bcrypt.compare(password, user.hash ?? '')))) {
      throw new ForbiddenException('Username or password does not match with any users.')
    }

    // create token
    const token = this.jwtService.sign({ id: user.id, key: uuidv4() })

    try {
      // await this.sessionsService.saveUserSession(request, token)
    } catch (e) {
      this.logger.debug(e)
      throw new InternalServerErrorException(
        'There was an error while creating a session for user. Please try again later.'
      )
    }

    this.emitter.strictEmitter<EventTypes>().emit(Events.USER_LOGIN, this.context.req, token)

    // send user without has and the token back to the user
    return {
      token,
      username: user.username
    }
  }
}
