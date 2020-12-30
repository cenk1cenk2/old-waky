import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoginResolver } from './login.resolver'
import { LoginService } from './login.service'
import { UserEntity } from '@waky/api/entities/user.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity ]) ],
  providers: [ LoginResolver, LoginService ]
})
export class LoginModule {}
