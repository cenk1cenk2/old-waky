import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import geo from 'geoip-lite'
import { Repository } from 'typeorm'
import UAParser from 'ua-parser-js'

import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'
import { WakyEventRequest, WakyEventResponse, Events } from '@waky/api/interfaces'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@Injectable()
export class SessionHandler {
  private logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserSessionEntity) private readonly userSessionRepository: Repository<UserSessionEntity>,
    @InjectRepository(MachineSessionEntity) private readonly machineSessionRepository: Repository<MachineSessionEntity>,
    private jwtService: JwtService
  ) {}

  @OnEvent(Events.USER_LOGIN, { promisify: true })
  public async sessionRegister (e: WakyEventRequest<Events.USER_LOGIN>): Promise<WakyEventResponse<Events.USER_LOGIN>> {
    // decode token
    const decodedToken = this.jwtService.decode(e.token) as DecodedToken
    const { id, ...rest } = decodedToken

    // get user ip
    const ip = e.req.headers['x-forwarded-for'] ?? e.req.ip

    const ua = new UAParser(e.req.headers['user-agent'])
    const browser = ua.getBrowser()
    const os = ua.getOS()
    const location = geo.lookup(ip)

    // generate user session details
    const sessionDetails: Partial<UserSessionEntity> = {
      ip,
      location: location?.city && location?.country ? `${location.city}/${location.country}` : 'unknown',
      browser: `${browser.name} ${browser.version}`,
      os: `${os.name}/${os.version}`
    }

    const session = new UserSessionEntity({
      userId: id,
      ...rest,
      ...sessionDetails
    })

    try {
      await this.userSessionRepository.save(session)

      this.logger.verbose(`New session registered for user id "${id}" from "${ip}".`)
    } catch (e) {
      throw new InternalServerErrorException(
        `There was an error while creating a session for user. Please try again later. ${e}`
      )
    }
  }

  @OnEvent(Events.SESSION_VERIFY, { promisify: true })
  public async sessionVerify (
    e: WakyEventRequest<Events.SESSION_VERIFY>
  ): Promise<WakyEventResponse<Events.SESSION_VERIFY>> {
    try {
      if (!e.machine) {
        // validate normal user session through login
        const entity = await this.userSessionRepository.findOneOrFail({
          where: {
            userId: e.id,
            key: e.key,
            iat: e.iat,
            exp: e.exp
          }
        })

        if (new Date(Date.now()) > entity.exp) {
          throw new UnauthorizedException('Session token has expired.')
        }
      } else {
        // validate api keys
        await this.machineSessionRepository.findOneOrFail({
          where: {
            userId: e.id,
            key: e.key
          }
        })
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err
      } else {
        throw new UnauthorizedException('Session token is not valid.')
      }
    }
  }
}
