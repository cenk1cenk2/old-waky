import { ApiProperty } from '@nestjs/swagger'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'
import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, ObjectID } from 'typeorm'
import { BaseEntity } from './util'

@Entity('Sessions')
export class SessionEntity extends BaseEntity<SessionEntity> implements DecodedToken {
  @ApiProperty({
    type: 'varchar',
    format: 'uuid',
    readOnly: true
  })
  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  parent: ObjectID

  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  @Exclude({ toPlainOnly: true })
  key: string

  @ApiProperty({
    type: 'varchar',
    format: 'time',
    readOnly: true
  })
  @IsNotEmpty()
  @Column('time', { nullable: false })
  exp: string

  @ApiProperty({
    type: 'varchar',
    format: 'time',
    readOnly: true
  })
  @IsNotEmpty()
  @Column('time', { nullable: false })
  iat: string

  @ApiProperty({
    type: 'varchar',
    format: 'ip',
    readOnly: true
  })
  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  ip: string

  @ApiProperty({
    type: 'varchar',
    format: 'ip',
    readOnly: true
  })
  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  geo?: string

  @ApiProperty({
    type: 'varchar',
    format: 'ip',
    readOnly: true
  })
  @IsNotEmpty()
  @Column('varchar', { nullable: false })
  browser: string
}
