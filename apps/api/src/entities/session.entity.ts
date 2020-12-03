import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, ObjectID } from 'typeorm'

import { BaseEntity } from './util'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@Entity('Sessions')
export class SessionEntity extends BaseEntity<SessionEntity> implements DecodedToken {
  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  parent: ObjectID

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
}
