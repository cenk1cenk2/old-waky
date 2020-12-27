import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@webundsoehne/nestjs-util'

import { ApplicationKey } from '@cenk1cenk2/nestjs-auth-key-generator'
import { JwtStrategy } from '@waky/api/guards/jwt.strategy'

@Global()
@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: { expiresIn: ConfigService.get('token.expiry', '1h') },
      secret: new ApplicationKey().key
    })
  ],
  providers: [ JwtStrategy ],
  exports: [ JwtStrategy, JwtModule, PassportModule ]
})
export class AuthGuardModule {}
