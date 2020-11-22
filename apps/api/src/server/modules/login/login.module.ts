import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@waky/api/entities/user.entity'

import { LoginResolver } from './login.resolver'

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity ]) ],
  providers: [ LoginResolver ]
})
export class LoginModule {}
