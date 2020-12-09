import { Events } from './events.interface'
import { TransactionMap, WithTransactionManager, GetTransactionType } from '@waky/nestjs-common'

/**
 * Internal transaction managers that are shared through out certain events
 */
export declare class WakyTransactionsMap implements TransactionMap<Events> {}

/**
 * Get the internal transaction type.
 */
export type WakyGetTransactionType<E extends Events> = GetTransactionType<E, WakyTransactionsMap>

/**
 * Get the transaction type to use with events
 */
export type WakyWithTransactionManager<E extends Events> = WithTransactionManager<E, WakyTransactionsMap>
