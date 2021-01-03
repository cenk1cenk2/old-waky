import { Field, ObjectType } from '@nestjs/graphql'
import { IsIP, IsMACAddress, IsNotEmpty, IsOptional } from 'class-validator'
import { Column, Entity } from 'typeorm'

import { BaseEntity } from './util'

@ObjectType()
@Entity('Machine')
export class MachineEntity extends BaseEntity<MachineEntity> {
  @IsNotEmpty()
  @Column('varchar')
  @Field(() => String)
  name: string

  @IsNotEmpty()
  @IsMACAddress()
  @Column('varchar')
  @Field(() => String)
  mac: string

  @IsOptional()
  @IsIP()
  @Column('varchar', { nullable: true })
  @Field(() => String)
  static?: string
}
