import { IBulkDeleteTransactionsRepository } from '@/repositories/transactions/bulk-delete-transactions'
import { IGetTransactionsByIdsRepository } from '@/repositories/transactions/get-transactions-by-ids'
import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { NotFound } from '@/routes/_errors/errors-instance'

import { IUpdateBalanceRepository } from '../users/update-balance'

export interface IBulkDeleteTransactionsService {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteTransactionsService implements IBulkDeleteTransactionsService {
  constructor(
    private bulkDeleteTransactionsRepository: IBulkDeleteTransactionsRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
    private getTransactionsByIds: IGetTransactionsByIdsRepository,
    private updateBalanceRepository: IUpdateBalanceRepository
  ) {}

  async execute(ids: string[], userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('User not found')
    }

    const transactions = await this.getTransactionsByIds.execute(ids, userId)

    const accounts: string[] = []

    transactions.forEach((transactions) => {
      const id = transactions.accountId

      const existsAccount = accounts.includes(id)

      if (existsAccount) {
        return
      }

      accounts.push(id)
    })

    const result = await this.bulkDeleteTransactionsRepository.execute(ids, userExists.id)

    await Promise.all(accounts.map((accountId) => this.updateBalanceRepository.execute(accountId)))

    return result
  }
}
