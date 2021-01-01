import { createApplication } from './init'

function bootstrap (): Promise<void> {
  return createApplication()
}

bootstrap()
