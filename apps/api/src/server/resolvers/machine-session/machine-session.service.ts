import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetMachineSessionsInput, RevokeTokenInput, UpdateTokenInput } from './machine-session.input'
import { RevokeTokenOutput, UpdateTokenOutput } from './machine-session.output'
import { findPaginatedResult, PaginatedResult } from '@cenk1cenk2/nestjs-typeorm'
import { MachineSessionEntity } from '@waky/api/entities/machine-session.entity'
import { UserEntity } from '@waky/api/entities/user.entity'

@Injectable()
export class MachineSessionService {
  constructor (
    @InjectRepository(MachineSessionEntity) private readonly machineSessionRepository: Repository<MachineSessionEntity>
  ) {}

  /**
   * Get all the API tokens from the database.
   *
   * @param {UserEntity} user
   * @param {GetMachineSessionsInput} { pagination }
   * @returns  {Promise<PaginatedResult<MachineSessionEntity>>}
   * @memberof MachineSessionService
   */
  public getMachineSessions (
    user: UserEntity,
    { pagination }: GetMachineSessionsInput
  ): Promise<PaginatedResult<MachineSessionEntity>> {
    return findPaginatedResult(this.machineSessionRepository, pagination, {
      where: { userId: user.id }
    })
  }

  /**
   * Revoke a set of API tokens for given user.
   *
   * @param {UserEntity} user
   * @param {RevokeTokenInput} args
   * @returns  {Promise<RevokeTokenOutput>}
   * @memberof MachineSessionService
   */
  public async revokeToken (user: UserEntity, args: RevokeTokenInput): Promise<RevokeTokenOutput> {
    const result = await this.machineSessionRepository
      .createQueryBuilder('machineSessions')
      .delete()
      .andWhere('machineSessions.userId = :userId', { userId: user.id })
      .andWhere('machineSessions.id IN (:ids)', { ids: args.id })
      .execute()

    return { result: `Deleted ${result.affected} API tokens.` }
  }

  /**
   * Update a session token with new data and such.
   *
   * @param {UserEntity} user
   * @param {UpdateTokenInput} { id, ...args }
   * @returns  {Promise<UpdateTokenOutput>}
   * @memberof MachineSessionService
   */
  public async updateToken (user: UserEntity, { id, ...args }: UpdateTokenInput): Promise<UpdateTokenOutput> {
    const entity = await this.machineSessionRepository.findOneOrFail({ where: { id, userId: user.id } })

    await this.machineSessionRepository.update(entity, args)

    return { result: 'Updated session token data.' }
  }
}
