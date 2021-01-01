import { Module, NestModule } from '@nestjs/common'
import { setEnvironmentVariables } from '@webundsoehne/nestjs-util'

import { createServerModule } from './server/server.module'
import { createTaskModule } from './task/task.module'

@Module({ imports: [ createServerModule(), createTaskModule() ] })
export class AppModule implements NestModule {
  public async configure (): Promise<void> {
    await setEnvironmentVariables()
  }
}
