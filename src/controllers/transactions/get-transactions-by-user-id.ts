import { startOfMonth } from 'date-fns'

import { TransactionWithCategory } from '@/repositories/transactions/get-transactions-by-user-id'
import { IGetTransactionsByUserIdService } from '@/services/transactions/get-transactions-by-user-id'

import { BadRequest } from '../../routes/_errors/errors-instance'

export interface IGetTransactionsByUserIdController {
  execute(userId: string, from: Date | null, to: Date | null, accountId: string): Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdController implements IGetTransactionsByUserIdController {
  constructor(private getTransactionsByUserIdService: IGetTransactionsByUserIdService) {}

  async execute(userId: string, from: Date | null, to: Date | null, accountId: string) {
    if (!userId) {
      throw new BadRequest('User Id is missing or not provided!')
    }

    const defaultTo = new Date()
    const defaultFrom = new Date(startOfMonth(defaultTo).setUTCHours(3))

    const fromDate = from ? new Date(from.setUTCHours(3)) : defaultFrom
    const toDate = to ? new Date(to.setUTCHours(3)) : defaultTo

    const transactions = await this.getTransactionsByUserIdService.execute(userId, fromDate, toDate, accountId)

    return transactions
  }
}
