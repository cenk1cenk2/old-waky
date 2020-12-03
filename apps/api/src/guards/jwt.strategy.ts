import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'

import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'
import { ApplicationKey } from '@waky/api/util/key'

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
    console.log('test')
    throw new Error('anan')

    return done(null, payload)
  }
}
