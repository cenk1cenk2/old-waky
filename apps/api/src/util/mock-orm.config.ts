import { getDatabaseOptions } from './database'

// @ts-ignore have to be written in that way for the type-orm migrations
export default getDatabaseOptions(true)
