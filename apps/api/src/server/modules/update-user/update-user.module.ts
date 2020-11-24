import { Module } from '@nestjs/common'

import { UpdateUserResolver } from './update-user.resolver'

@Module({
  providers: [UpdateUserResolver]
})
export class UpdateUserModule {}
