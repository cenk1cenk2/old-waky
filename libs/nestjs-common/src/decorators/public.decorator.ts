import { SetMetadata } from '@nestjs/common'

export const PublicDecorator = Symbol('isPublic')

export function Public () {
  return SetMetadata(PublicDecorator, true)
}
