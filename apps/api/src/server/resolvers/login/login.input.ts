import { ArgsType, Field, PickType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

import { UserEntity } from '@waky/api/entities/user.entity'

@ArgsType()
export class CheckAuthenticationInput {
  @IsString()
  @Field(() => String)
  token: string
}

@ArgsType()
export class LoginInput extends PickType(UserEntity, [ 'username', 'password' ], ArgsType) {}

@ArgsType()
export class CreateTokenInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string
}
