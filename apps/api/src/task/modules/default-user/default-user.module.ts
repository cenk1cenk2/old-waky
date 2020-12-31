import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DefaultUserTask } from './default-user.task'
import { UserEntity } from '@waky/api/entities/user.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity ]) ],
  providers: [ DefaultUserTask ],
  exports: [ DefaultUserTask ]
})
export class DefaultUserTaskModule {}
