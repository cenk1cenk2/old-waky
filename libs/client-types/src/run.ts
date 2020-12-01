/* eslint-disable no-console */
import { generate } from '@graphql-codegen/cli'
import config from 'config'
import delay from 'delay'
import * as fs from 'fs-extra'
import { join } from 'path'

async function bootstrap (): Promise<unknown> {
  const schema = config.get<Schema[]>('schema')
  let status: Status[] = getStatus(schema)

  while (getStatus(schema).some((v) => v.status === false)) {
    console.error(
      `Schema files is not generated yet: ${status
        .filter((s) => !s.status)
        .map((s) => s.from)
        .join(', ')}`
    )
    await delay(5000)
    status = getStatus(schema)
  }

  return Promise.all(
    schema.map((s) =>
      generate(
        {
          watch: true,
          // watchConfig: {
          //   usePolling: true,
          //   interval: 3000
          // },
          schema: s.from,
          generates: {
            [join('src', s.to)]: {
              plugins: [ 'typescript' ],
              hooks: {
                afterOneFileWrite: [ 'prettier --write', 'eslint --fix' ]
              }
            }
          }
        },
        true
      )
    )
  )
}

function getStatus (schema: Schema[]): Status[] {
  return schema.map((s) => ({ from: s.from, status: fs.existsSync(s.from) }))
}

interface Schema {
  from: string
  to: string
}

interface Status {
  from: string
  status: boolean
}

bootstrap()
