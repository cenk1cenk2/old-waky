import { Field, ObjectType } from '@nestjs/graphql'
import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from './util'
import { UserEntity } from '@waky/api/entities/user.entity'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@ObjectType()
@Entity('MachineSessions')
export class MachineSessionEntity extends BaseEntity<MachineSessionEntity> implements Partial<DecodedToken> {
  @IsNotEmpty()
  @Column('varchar', { name: 'user_id', nullable: false })
  @Field(() => String)
  userId: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Field(() => String)
  token: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Exclude({ toPlainOnly: true })
  key: string

  // relations-incoming
  @ManyToOne(() => UserEntity, (user) => user.machineSessions)
  @JoinColumn({ name: 'user_id' })
  @Field(() => UserEntity)
  user: UserEntity
}
