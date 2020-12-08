import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'

export abstract class BaseEntity<T> {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    readOnly: true
  })
  @PrimaryGeneratedColumn()
  id?: string

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    readOnly: true
  })
  @CreateDateColumn({ type: 'datetime', name: 'createdAt' })
  createdAt?: Date

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    readOnly: true
  })
  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  updatedAt?: Date

  @ApiProperty({ type: 'number', readOnly: true })
  @VersionColumn()
  version?: number

  constructor (object: Partial<T & BaseEntity<T>>) {
    Object.assign(this, object)
  }
}
