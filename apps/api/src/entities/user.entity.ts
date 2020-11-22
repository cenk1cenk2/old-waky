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

  @Column('varchar', { nullable: false, select: false })
  @Exclude({ toPlainOnly: true })
  @Field({ nullable: false })
  hash?: string

  password?: string

  @BeforeInsert()
  @BeforeUpdate()
  public encryptPassword (): void {
    if (this.password) {
      this.hash = bcrypt.hashSync(this.password)
      delete this.password
    }
  }
}

@ObjectType()
export class UserWithTokenDto extends UserEntity {
  @Field({ nullable: false })
  token?: string
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
