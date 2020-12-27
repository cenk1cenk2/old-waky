import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'

import { ApplicationKey } from '@cenk1cenk2/nestjs-auth-key-generator'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor () {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new ApplicationKey().key,
      passReqToCallback: true
    })
  }

  public async validate (req: FastifyRequest, payload: DecodedToken, done: VerifiedCallback): Promise<void> {
    // await this.sessionsService.verifyUserSession(payload)

    return done(null, payload)
  }
}
