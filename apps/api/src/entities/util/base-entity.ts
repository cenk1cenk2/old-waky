import { Field, ObjectType } from '@nestjs/graphql'
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'

@ObjectType({ isAbstract: true })
export abstract class BaseEntity<T> {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string

  @Field(() => Date)
  @CreateDateColumn({ type: 'datetime', name: 'createdAt' })
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  updatedAt: Date

  @Field(() => Number)
  @VersionColumn()
  version: number

  constructor (object: Partial<T & BaseEntity<T>>) {
    Object.assign(this, object)
  }
}
