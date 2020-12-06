import { ArgsType, PickType } from '@nestjs/graphql'

import { UserEntity } from '@waky/api/entities/user.entity'

@ArgsType()
export class LoginInput extends PickType(UserEntity, [ 'username', 'password' ], ArgsType) {}
