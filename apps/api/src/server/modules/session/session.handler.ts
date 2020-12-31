import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import geo from 'geoip-lite'
import { Repository } from 'typeorm'
import UAParser from 'ua-parser-js'

import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'
import { UserEntity } from '@waky/api/entities/user.entity'
import { WakyEventRequest, WakyEventResponse, Events } from '@waky/api/interfaces'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@Injectable()
export class SessionHandler {
  private logger: Logger = new Logger(this.constructor.name)

  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserSessionEntity) private readonly userSessionRepository: Repository<UserSessionEntity>,
    @InjectRepository(MachineSessionEntity) private readonly machineSessionRepository: Repository<MachineSessionEntity>,
    private jwtService: JwtService
  ) {}

  /**
   * Register a new user session through a event.
   *
   * @param {WakyEventRequest<Events.USER_LOGIN>} e
   * @returns  {Promise<WakyEventResponse<Events.USER_LOGIN>>}
   * @memberof SessionHandler
   */
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
      throw new InternalServerErrorException(`Can not create a session for user. Please try again later. ${e}`)
    }
  }

  /**
   * Creates an API token for given user.
   *
   * @param {WakyEventRequest<Events.CREATE_MACHINE_SESSION>} e
   * @returns  {Promise<WakyEventResponse<Events.CREATE_MACHINE_SESSION>>}
   * @memberof SessionHandler
   */
  @OnEvent(Events.CREATE_MACHINE_SESSION, { promisify: true })
  public async createMachineSessions (
    e: WakyEventRequest<Events.CREATE_MACHINE_SESSION>
  ): Promise<WakyEventResponse<Events.CREATE_MACHINE_SESSION>> {
    // decode token
    const decodedToken = this.jwtService.decode(e.token) as DecodedToken
    const { id, ...rest } = decodedToken

    const session = new MachineSessionEntity({
      userId: id,
      key: rest.key,
      token: e.token
    })

    try {
      await this.machineSessionRepository.save(session)

      this.logger.verbose(`Generated a API token for user id "${id}".`)
    } catch (e) {
      throw new InternalServerErrorException(`Can not create a new API token. Please try again later. ${e}`)
    }
  }

  /**
   * Verify a user or API token session to be valid or not.
   *
   * @param {WakyEventRequest<Events.SESSION_VERIFY>} e
   * @returns  {Promise<WakyEventResponse<Events.SESSION_VERIFY>>}
   * @memberof SessionHandler
   */
  @OnEvent(Events.SESSION_VERIFY, { promisify: true })
  public async sessionVerify (
    e: WakyEventRequest<Events.SESSION_VERIFY>
  ): Promise<WakyEventResponse<Events.SESSION_VERIFY>> {
    if (!e.machine) {
      // check the expiry manually, because we dont want to check it for api tokens
      if (new Date(Date.now()) > new Date(e.exp * 1000)) {
        throw new UnauthorizedException('Session has expired.')
      }

      // validate normal user login
      const entity = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: e.id })
        .innerJoin('user.userSessions', 'userSessions')
        .andWhere('userSessions.key = :key', { key: e.key })
        .andWhere('userSessions.iat = :iat', { iat: e.iat })
        .andWhere('userSessions.exp = :exp', { exp: e.exp })
        .getOne()

      if (!entity) {
        throw new UnauthorizedException('Session token is not valid.')
      }

      return entity
    } else {
      const entity = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: e.id })
        .innerJoin('user.machineSessions', 'machineSessions')
        .andWhere('machineSessions.key =: key', { key: e.key })
        .getOne()

      if (!entity) {
        throw new UnauthorizedException('API token is not valid.')
      }

      return entity
    }
  }
}
