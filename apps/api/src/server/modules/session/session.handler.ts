import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { SessionEntity } from '@waky/api/entities/session.entity'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'
import { Events } from '@waky/api/interfaces/emitter.interface'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'
import geo from 'geoip-lite'
import { On } from 'nest-event'
import { Repository } from 'typeorm'
import { UAParser } from 'ua-parser-js'

@Injectable()
export class SessionHandler {
  private logger: Logger = new Logger(this.constructor.name)

  constructor(
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    private jwtService: JwtService
  ) {}

  @On(Events.USER_LOGIN)
  public async onUserLogin(req: GraphQLContext['req'], token: string) {
    // decode token
    const decodedToken = this.jwtService.decode(token) as DecodedToken
    const { id, ...rest } = decodedToken

    // get user ip
    const ip = req.headers['x-forwarded-for'] ?? req.ip

    const ua = new UAParser(req.headers['user-agent'])
    const uaBrowser = new UAParser(req.headers['user-agent']).getBrowser()
    const uaOs = new UAParser(req.headers['user-agent']).getOS()
    const location = geo.lookup(ip)

    // generate user session details
    const sessionDetails = {
      ip,
      geo: location?.city && location?.country ? `${location.city}/${location.country}` : 'unknown',
      browser: `${uaOs.name} ${uaOs.version} ${uaBrowser.name} ${uaBrowser.version}`
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
      this.logger.error(e.message, e)
    }
  }
}
