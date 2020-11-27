import { Module, Global } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@webundsoehne/nestjs-util'

import { JwtStrategy } from '@waky/api/guards/jwt.strategy'
import { ApplicationKey } from '@waky/api/util/key'

@Global()
@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: { expiresIn: ConfigService.get('misc.token.expiry') },
      secret: new ApplicationKey().key
    })
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy, JwtModule, PassportModule]
})
export class AuthGuardModule {}
