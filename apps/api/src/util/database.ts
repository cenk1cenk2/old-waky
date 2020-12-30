import { ConfigService } from '@webundsoehne/nestjs-util'
import { join } from 'path'
import { ConnectionOptions } from 'typeorm'

const { mock: mockOptions = {}, directories, ...options } = ConfigService.get('database')

const databaseOptions = {
  ...options,
  entities: [ join(process.cwd(), `${directories.entity}/*.entity{.ts,.js}`) ],
  migrations: [ join(process.cwd(), `./${directories.migration}/*{.ts,.js}`) ],
  cli: {
    entitiesDir: directories.entity,
    migrationsDir: `./${directories.migration}`
  },
  seeds: [ join(process.cwd(), `./${directories.seed}/**/*.seed{.ts,.js}`) ],
  factories: [ join(process.cwd(), `./${directories.seed}/**/*.factory{.ts,.js}`) ]
}

export function getDatabaseOptions (mock = false): ConnectionOptions {
  return mock ? { ...databaseOptions, ...mockOptions } : databaseOptions
}
