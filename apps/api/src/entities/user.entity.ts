import { Field, ObjectType } from '@nestjs/graphql'
import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, Unique } from 'typeorm'

import { MachineSessionEntity } from './machine-session.entity'
import { BaseEntity } from './util'
import { UserSessionEntity } from '@waky/api/entities/user-session.entity'

@ObjectType()
@Entity('Users')
@Unique([ 'username' ])
export class UserEntity extends BaseEntity<UserEntity> {
  @Column('varchar', {
    unique: true,
    length: 32,
    nullable: false
  })
  @IsString({ always: true })
  @MaxLength(32)
  @IsNotEmpty()
  @Field({ nullable: false })
  username?: string

  @IsString({ always: true })
  @Column('varchar', { nullable: false })
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @Field({ nullable: true })
  hash?: string

  @Field({ nullable: true })
  @IsString({ always: true })
  @MaxLength(32)
  @IsNotEmpty()
  password?: string

  // relations-outgoing
  @Field(() => [ UserSessionEntity ], { nullable: true })
  @OneToMany(() => UserSessionEntity, (session) => session.user, { nullable: true })
  userSessions?: UserSessionEntity[]

  @Field(() => [ MachineSessionEntity ], { nullable: true })
  @OneToMany(() => MachineSessionEntity, (session) => session.user, { nullable: true })
  machineSessions?: MachineSessionEntity[]

  @BeforeInsert()
  @BeforeUpdate()
  public async encryptPassword (): Promise<void> {
    if (this.password) {
      this.hash = await bcrypt.hash(this.password, 10)
      delete this.password
    }
  }
}
