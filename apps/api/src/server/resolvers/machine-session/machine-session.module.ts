import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MachineSessionResolver } from './machine-session.resolver'
import { MachineSessionService } from './machine-session.service'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ MachineSessionEntity ]) ],
  providers: [ MachineSessionService, MachineSessionResolver ]
})
export class MachineSessionModule {}
