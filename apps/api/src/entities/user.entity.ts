import { Field, ObjectType } from '@nestjs/graphql'
import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from 'typeorm'

import { BaseEntity } from './util'

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
  @IsOptional({ groups: [ 'update' ] })
  @Field({ nullable: false })
  username?: string

  @IsString({ always: true })
  @Column('varchar', { nullable: false })
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @Field({ nullable: true })
  hash?: string

  @Field({ nullable: true })
  password?: string

  @BeforeInsert()
  @BeforeUpdate()
  public async encryptPassword (): Promise<void> {
    if (this.password) {
      this.hash = await bcrypt.hash(this.password, 10)
      delete this.password
    }
  }
}

@ObjectType()
export class UserWithPasswordDto extends UserEntity {
  @IsString({ always: true })
  @MaxLength(32)
  @MinLength(6)
  @IsNotEmpty()
  @IsOptional({ groups: [ 'update' ] })
  @Field({ nullable: true })
  password?: string
}
