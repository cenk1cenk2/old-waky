import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import geo from 'geoip-lite'
import { Repository } from 'typeorm'
import UAParser from 'ua-parser-js'

import { SessionEntity } from '@waky/api/entities/session.entity'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'
import { Events, EventTypes } from '@waky/api/interfaces/emitter.interface'

@Injectable()
export class SessionHandler {
  private logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    private jwtService: JwtService
  ) {}

  @OnEvent(Events.USER_LOGIN, { promisify: true })
  public async sessionRegister (
    e: EventTypes[Events.USER_LOGIN]['request']
  ): Promise<EventTypes[Events.USER_LOGIN]['response']> {
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
    const sessionDetails: Partial<SessionEntity> = {
      ip,
      geo: location?.city && location?.country ? `${location.city}/${location.country}` : 'unknown',
      browser: `${browser.name} ${browser.version}`,
      os: `${os.name}/${os.version}`
    }

    const session = new SessionEntity({
      parent: id,
      ...rest,
      ...sessionDetails
    })

    try {
      await this.sessionRepository.save(session)

      this.logger.verbose(`New session registered for user id "${id}" from "${ip}".`)
    } catch (e) {
      throw new InternalServerErrorException(
        `There was an error while creating a session for user. Please try again later. ${e}`
      )
    }
  }
}
