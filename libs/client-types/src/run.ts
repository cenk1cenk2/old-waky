/* eslint-disable no-console */
import { generate } from '@graphql-codegen/cli'
import config from 'config'
import delay from 'delay'
import * as fs from 'fs-extra'

async function bootstrap (): Promise<unknown> {
  const schema = config.get<string>('schema')

  while (!fs.existsSync(schema)) {
    console.error(`Schema file is not generated yet: ${schema}`)
    await delay(5000)
  }

  return generate(
    {
      watch: true,
      // watchConfig: {
      //   usePolling: true,
      //   interval: 3000
      // },
      schema,
      generates: {
        'src/index.ts': {
          plugins: [ 'typescript' ],
          hooks: {
            afterOneFileWrite: [ 'prettier --write', 'eslint --fix' ]
          }
        }
      }
    },
    true
  )
}

bootstrap()
