import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetMachineSessionsInput } from './machine-session.input'
import { findPaginatedResult, PaginatedResult } from '@cenk1cenk2/nestjs-typeorm'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'

@Injectable()
export class MachineSessionService {
  constructor (
    @InjectRepository(MachineSessionEntity) private readonly machineSessionRepository: Repository<MachineSessionEntity>
  ) {}

  public getMachineSessions ({ pagination,
    ...args }: GetMachineSessionsInput): Promise<PaginatedResult<MachineSessionEntity>> {
    return findPaginatedResult(this.machineSessionRepository, pagination, {
      where: { userId: args.userId }
    })
  }
}
