import { Field, ObjectType } from '@nestjs/graphql'
import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, Unique } from 'typeorm'

import { BaseEntity } from './util'
import { SessionEntity } from '@waky/api/entities/session.entity'
import { Events } from '@waky/api/interfaces'

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
  @IsNotEmpty({ groups: [ Events.USER_LOGIN ] })
  password?: string

  // relations-outgoing
  @Field(() => [ SessionEntity ], { nullable: true })
  @ManyToOne(() => SessionEntity, (session) => session.user, { nullable: true })
  sessions?: SessionEntity[]

  @BeforeInsert()
  @BeforeUpdate()
  public async encryptPassword (): Promise<void> {
    if (this.password) {
      this.hash = await bcrypt.hash(this.password, 10)
      delete this.password
    }
  }
}
