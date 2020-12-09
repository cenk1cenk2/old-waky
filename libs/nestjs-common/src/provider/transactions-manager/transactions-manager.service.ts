import { Injectable, Logger, Scope } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { InitialTransaction, ParallelTransaction, GetTransactionType } from './transactions-manager.interface'

@Injectable({ scope: Scope.REQUEST })
export class TransactionsManager<
  Event extends string = never,
  Map extends Partial<Record<Event, any>> = Partial<Record<Event, any>>
> {
  private transactions: ParallelTransaction<Event, Map>[] = []
  private initialTransactions: InitialTransaction<Event, Map>[] = []
  private results: GetTransactionType<Event, Map> = {} as GetTransactionType<Event, Map>
  private logger: Logger = new Logger(this.constructor.name)

  constructor (@InjectConnection() private connection: Connection) {}

  /**
   * Add a new transaction which will execute asynchronously.
   * @param transaction
   */
  public add (transaction: ParallelTransaction<Event, Map>): void {
    this.transactions.push(transaction)

    this.logger.debug('Injected a new transaction.')
  }

  /**
   * Add an initial transaction where you can map the result to a key.
   * @param token
   * @param transaction
   */
  public addInitial (transaction: InitialTransaction<Event, Map>): void {
    this.initialTransactions.push(transaction)

    this.logger.debug(`Injected a new preliminary transaction with token: ${transaction.token}`)
  }

  /**
   * Run all the transactions and rollback all if one has failed.
   * This will run initial transactions and wait for the result,
   */
  public async run (): Promise<GetTransactionType<Event, Map>> {
    const queryRunner = this.connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // first perform the initial transactions sequentially, did not find any good way to this
      while (this.initialTransactions.length > 0) {
        await Promise.all(
          this.initialTransactions.map(async (t, index) => {
            if (
              // might not have the depends on entry at all
              !t.dependsOn ||
              // might have the depends on entry but the transaction may already be finished
              t.dependsOn.length > 0 &&
                t.dependsOn.every((dependent) => Object.keys(this.results).includes(dependent as string))
            ) {
              // run the transaction
              this.results[t.token] = await t.transaction(queryRunner.manager, this.results)

              // remove this transaction on queue
              this.initialTransactions.splice(index, 1)

              this.logger.debug(`Finished initial transaction: ${t.token}`)
            } else {
              this.logger.debug(`Transaction still depends on others: ${t.token} depends on ${t.dependsOn.join(', ')}`)
            }
          })
        )
      }

      // then run the rest
      await Promise.all(this.transactions.map(async (t) => t.transaction(queryRunner.manager, this.results)))

      // commit all the transactions
      await queryRunner.commitTransaction()

      // we have to do it here as well to throw the error instead of finally
      // you need to release a queryRunner which was manually instantiated
      this.initialTransactions = []
      this.transactions = []

      await queryRunner.release()

      this.logger.debug('Commited transactions.')

      return this.results
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction()

      // we have to do it here as well to throw the error instead of finally
      // you need to release a queryRunner which was manually instantiated
      this.initialTransactions = []
      this.transactions = []

      await queryRunner.release()

      this.logger.error(`Rolling back transactions: ${err}`)

      // throw error to catch it with the exception filter instead of handling it
      throw err
    }
  }
}
