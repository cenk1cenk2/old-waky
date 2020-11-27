import { createApplication as createServerApplication } from './server/init'

function bootstrap(): Promise<void> {
  return createServerApplication()
}

bootstrap()
