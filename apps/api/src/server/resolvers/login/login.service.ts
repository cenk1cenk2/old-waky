import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { CreateTokenInput, LoginInput, CheckAuthenticationInput } from './login.input'
import { CreateTokenOutput, LoginOutput, CheckAuthenticationOutput } from './login.output'
import { EventManager } from '@cenk1cenk2/nestjs-emitter'
import { UserEntity } from '@waky/api/entities/user.entity'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'
import { WakyEventManager } from '@waky/api/interfaces/emitter.interface'
import { Events } from '@waky/api/interfaces/events.interface'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'

@Injectable()
export class LoginService {
  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(CONTEXT) private readonly context: GraphQLContext,
    @Inject(EventManager) private readonly emitter: WakyEventManager,
    private jwtService: JwtService
  ) {}

  public async checkAuthentication (args: CheckAuthenticationInput): Promise<CheckAuthenticationOutput> {
    try {
      await this.emitter.emit(Events.SESSION_VERIFY, this.jwtService.decode(args.token) as DecodedToken)

      return { result: true }
    } catch (e) {
      if (!(e instanceof UnauthorizedException)) {
        throw e
      }
      return { result: false }
    }
  }

  /**
   * Login with a username and password.
   *
   * @param {LoginInput} args
   * @returns  {Promise<LoginOutput>}
   * @memberof LoginService
   */
  public async login (args: LoginInput): Promise<LoginOutput> {
    // get user from database
    const user = await this.userRepository.findOne({ username: args.username })

    // check if user in database exists and database password matches
    if (!(user && await bcrypt.compare(args.password, user.hash ?? ''))) {
      throw new ForbiddenException('Credentials does not match with any users.')
    }

    // create token
    const token = this.signToken(user)

    await this.emitter.emit(Events.USER_LOGIN, { req: this.context.req, token })

    // send user without has and the token back to the user
    return {
      token,
      user
    }
  }

  /**
   * Create a machine token that could be used for automated requests.
   *
   * @param {UserEntity} user
   * @returns  {Promise<void>}
   * @memberof LoginService
   */
  public async createToken (user: UserEntity, args: CreateTokenInput): Promise<CreateTokenOutput> {
    const token = this.signToken(user)

    await this.emitter.emit(Events.CREATE_MACHINE_SESSION, { token, description: args.description })

    return { token }
  }

  /**
   * Sign a token with current user and generate a random key id for
   * for further checks.
   *
   * @private
   * @param {UserEntity} user
   * @returns  {string}
   * @memberof LoginService
   */
  private signToken (user: UserEntity): string {
    return this.jwtService.sign({ id: user.id, key: uuidv4() })
  }
}
