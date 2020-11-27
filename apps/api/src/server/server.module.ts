import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  BadRequestExceptionFilter,
  ConfigService,
  ExtendedValidationPipe,
  GlobalExceptionFilter,
  InternalModule,
  MaintenanceMiddleware,
  MaintenanceModule,
  SetApiInfoHeaderMiddleware,
  setEnvironmentVariables
} from '@webundsoehne/nestjs-util'
import { NestEventModule } from 'nest-event'
import { join } from 'path'

import { getDatabaseOptions } from '../util/database'
import { graphQLContextParser, graphQLErrorParser } from './graphql-setup'
import * as modules from './modules'
import { SessionModule } from './modules/session/session.module'
import { ApplicationAuthGuard } from '@waky/api/guards/auth.guard'
import { AuthGuardModule } from '@waky/api/guards/auth.guard.module'
import { createTaskModule } from '@waky/api/task/task.module'

export function createServerModule (mock = false): new (mock: boolean) => NestModule {
  @Module({
    providers: [
      ConfigService,
      {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter
      },
      {
        provide: APP_FILTER,
        useClass: BadRequestExceptionFilter
      },
      {
        provide: APP_PIPE,
        useClass: ExtendedValidationPipe
      },
      {
        provide: APP_GUARD,
        useClass: ApplicationAuthGuard
      }
    ],
    imports: [
      GraphQLModule.forRoot({
        autoSchemaFile: join(process.cwd(), '.graphql/schema.gql'),
        context: graphQLContextParser,
        formatError: graphQLErrorParser,
        useGlobalPrefix: true,
        playground: true,
        introspection: true,
        path: '/'
      }),
      ...Object.values(modules),
      TypeOrmModule.forRoot(getDatabaseOptions(mock)),
      InternalModule,
      MaintenanceModule,
      NestEventModule,
      createTaskModule(),
      AuthGuardModule,
      SessionModule
    ]
  })
  class ServerModule implements NestModule {
    async configure (consumer: MiddlewareConsumer): Promise<void> {
      await setEnvironmentVariables()

      consumer
        .apply(MaintenanceMiddleware, SetApiInfoHeaderMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL })
    }
  }

  return ServerModule
}
