import { ObjectID } from 'typeorm'

export class DecodedToken {
  id?: ObjectID
  exp: string
  iat: string
  key: string
  machine?: boolean
}
