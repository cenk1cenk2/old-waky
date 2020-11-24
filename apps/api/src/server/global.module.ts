import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ApplicationKey } from '@waky/api/util/key'
import { ConfigService } from '@webundsoehne/nestjs-util'

@Global()
@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: { expiresIn: ConfigService.get('misc.token.expiry') },
      secret: new ApplicationKey().key
    })
  ],
  exports: [JwtModule, PassportModule]
})
export class GlobalModules {}
