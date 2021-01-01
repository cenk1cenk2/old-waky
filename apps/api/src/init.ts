import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService, SwaggerService } from '@webundsoehne/nestjs-util'

import { AppModule } from './app.module'
import { LoggerService } from '@cenk1cenk2/nestjs-utils'

export async function createApplication (): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: new LoggerService()
  })

  const port: number = ConfigService.get('port') ?? 3000
  const prefix: string = ConfigService.get('url.apiPath') ?? ''

  app.enableCors()

  app.setGlobalPrefix(prefix)

  SwaggerService.enable(app)

  await app.listen(port, '0.0.0.0')
}
