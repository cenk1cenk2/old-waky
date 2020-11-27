import { ConfigService } from '@webundsoehne/nestjs-util'
import * as fs from 'fs-extra'
import keypair from 'keypair'
import { join } from 'path'

import { LoggerService } from '@waky/nestjs-common'

let ApplicationKeyInstance: ApplicationKey

export class ApplicationKey {
  public key: string

  constructor() {
    if (!ApplicationKeyInstance) {
      this.getKey()

      ApplicationKeyInstance = this
    }

    return ApplicationKeyInstance
  }

  private getKey(): void {
    const logger = new LoggerService({ context: 'AuthKey' })
    const keyPath = join(process.cwd(), ConfigService.get('misc.token.key') ?? './volumes/app.key')
    let key: string

    try {
      key = fs.readFileSync(keyPath, { encoding: 'utf-8' })
      logger.debug('Application key loaded.')
    } catch (e) {
      try {
        logger.warn('Application key not found generating a new one.')

        const { private: key } = keypair({ bits: 256 })

        fs.ensureFileSync(keyPath)
        fs.writeFileSync(keyPath, key)
        logger.debug('Application key generated.')
      } catch (e) {
        logger.error('Unable to generate application key.')
      }
    }

    this.key = key
  }
}
