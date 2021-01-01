import { Module } from '@nestjs/common'

import { createServerModule } from './server/server.module'
import { createTaskModule } from './task/task.module'

@Module({ imports: [ createServerModule(), createTaskModule() ] })
export class AppModule {}
