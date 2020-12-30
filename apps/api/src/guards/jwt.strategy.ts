import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserEntity } from '../entities/user.entity'
import { Events, WakyEventManager } from '../interfaces'
import { ApplicationKey } from '@cenk1cenk2/nestjs-auth-key-generator'
import { EventManager } from '@cenk1cenk2/nestjs-emitter'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor (@Inject(EventManager) private emitter: WakyEventManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: new ApplicationKey().key,
      passReqToCallback: true
    })
  }

  public async validate (_req: FastifyRequest, payload: DecodedToken): Promise<UserEntity> {
    return this.emitter.emit(Events.SESSION_VERIFY, payload)
  }
}
