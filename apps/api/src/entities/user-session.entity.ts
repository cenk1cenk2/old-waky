import { Field, ObjectType } from '@nestjs/graphql'
import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from './util'
import { UserEntity } from '@waky/api/entities/user.entity'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@ObjectType()
@Entity('UserSessions')
export class UserSessionEntity extends BaseEntity<UserSessionEntity> implements DecodedToken {
  @IsNotEmpty()
  @Column('varchar', { name: 'user_id', nullable: false })
  @Field(() => String)
  userId: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Exclude({ toPlainOnly: true })
  key: string

  @IsNotEmpty()
  @Column('time', { nullable: false })
  @Field(() => Date)
  exp: Date

  @IsNotEmpty()
  @Column('time', { nullable: false })
  @Field(() => Date)
  iat: Date

  @Column('varchar', { nullable: false })
  @Field(() => String)
  ip: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Field(() => String)
  location: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Field(() => String)
  os: string

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Field(() => String)
  browser: string

  // relations-incoming
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.userSessions)
  @JoinColumn({ name: 'user_id' })
  @Field(() => UserEntity)
  user: UserEntity
}
