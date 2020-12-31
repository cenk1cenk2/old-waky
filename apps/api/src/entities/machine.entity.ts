import { Field, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity } from 'typeorm'

import { BaseEntity } from './util'
import { DecodedToken } from '@waky/api/interfaces/decoded-token.interface'

@ObjectType()
@Entity('Machine')
export class MachineEntity extends BaseEntity<MachineEntity> implements Partial<DecodedToken> {
  @IsNotEmpty()
  @Column('varchar')
  @Field(() => String)
  name: string

  @IsNotEmpty()
  @Column('varchar')
  @Field(() => String)
  mac: string
}
