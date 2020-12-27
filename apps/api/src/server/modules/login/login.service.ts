import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { LoginInput } from './login.input'
import { LoginOutput } from './login.output'
import { EventManager } from '@cenk1cenk2/nestjs-emitter'
import { UserEntity } from '@waky/api/entities/user.entity'
import { WakyEventManager } from '@waky/api/interfaces/emitter.interface'
import { Events } from '@waky/api/interfaces/events.interface'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'

@Injectable()
export class LoginService {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(CONTEXT) private readonly context: GraphQLContext,
    @Inject(EventManager) private readonly emitter: WakyEventManager,
    private jwtService: JwtService
  ) {}

  public async login (args: LoginInput): Promise<LoginOutput> {
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
      user
    }
  }
}
