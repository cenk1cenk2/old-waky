import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@waky/api/entities/user.entity'

import { DefaultUserTask } from './default-user.task'

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity ]) ],
  providers: [ DefaultUserTask ],
  exports: [ DefaultUserTask ]
})
export class DefaultUserModule {}
