import { Field } from '@nestjs/graphql'
import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from './util'
import { UserEntity } from '@waky/api/entities/user.entity'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@Entity('Sessions')
export class SessionEntity extends BaseEntity<SessionEntity> implements DecodedToken {
  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  parent: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Exclude({ toPlainOnly: true })
  key: string

  @IsNotEmpty()
  @Column('time', { nullable: false })
  exp: string

  @IsNotEmpty()
  @Column('time', { nullable: false })
  iat: string

  @Column('varchar', { nullable: false })
  ip: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  geo: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  os: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  browser: string

  // relations-incoming
  @Field(() => UserEntity)
  @OneToMany(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: 'parent' })
  user: UserEntity
}
