import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { createTaskModule } from '@waky/api/task/task.module'
import {
  ConfigService,
  BadRequestExceptionFilter,
  GlobalExceptionFilter,
  InternalModule,
  MaintenanceMiddleware,
  MaintenanceModule,
  SetApiInfoHeaderMiddleware,
  setEnvironmentVariables,
  ExtendedValidationPipe
} from '@webundsoehne/nestjs-util'
import { join } from 'path'

import { getDatabaseOptions } from '../util/database'
import { GlobalModules } from './global.module'
import { graphQLContextParser, graphQLErrorParser } from './graphql-setup'
import * as modules from './modules'

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
      GlobalModules,
      createTaskModule()
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
