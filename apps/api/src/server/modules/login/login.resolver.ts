import { ForbiddenException, InternalServerErrorException, Logger } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity, UserWithTokenDto } from '@waky/api/entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { classToPlain } from 'class-transformer'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Resolver(UserWithTokenDto)
export class LoginResolver {
  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  @Query(() => UserWithTokenDto)
  public async login(
    @Args({
      name: 'username'
    })
    username: string,
    @Args({
      name: 'password'
    })
    password: string
  ): Promise<UserWithTokenDto> {
    // get user from database
    const user = await this.userRepository.findOne({ username })

    console.log(user)

    // check if user in database exists and database password matches
    if (!(user && bcrypt.compareSync(password, user.hash ?? ''))) {
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

    // send user without has and the token back to the user
    return {
      token,
      ...classToPlain(user)
    } as UserWithTokenDto
  }
}
