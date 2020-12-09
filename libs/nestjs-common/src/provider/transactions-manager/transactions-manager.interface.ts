import { EntityManager } from 'typeorm'

import { TransactionsManager } from './transactions-manager.service'

/**
 * A singular transaction.
 */
export type Transaction<T, R> = (manager: EntityManager, results?: T) => Promise<R>

/**
 * The type of parallel transactions which will be run after.
 */
// made this an object too, to refactor fast between initial and parallel transaction
export interface ParallelTransaction<E extends string, M extends Partial<Record<E, any>>> {
  transaction: Transaction<GetTransactionType<E, M>, void>
}

/**
 * A type of initial transaction, which will run first and can return a result.
 */
export interface InitialTransaction<E extends string, M extends Partial<Record<E, any>>> {
  token: keyof GetTransactionType<E, M>
  transaction: Transaction<GetTransactionType<E, M>, GetTransactionType<E, M>[keyof GetTransactionType<E, M>]>
  dependsOn?: (keyof GetTransactionType<E, M>)[]
}

/**
 * Get the type of the transaction manager given the map and keys
 */
export type GetTransactionType<E extends string, M extends Partial<Record<E, any>>> = E extends keyof M ? M[E] : never

/**
 * Get the transaction type to use with events
 */
export type WithTransactionManager<E extends string, M extends Partial<Record<E, any>>> = {
  transactions: TransactionsManager<E, M>
}

/**
 * For fast typing the event map.
 */
export type TransactionMap<Events extends string> = Partial<Record<Events, any>>
