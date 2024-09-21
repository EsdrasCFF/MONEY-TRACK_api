import dayjs from '@/lib/dayjs-setup'
import { TransactionWithCategory } from '@/repositories/transactions/get-transactions-by-user-id'
import { IGetTransactionsByUserIdService } from '@/services/transactions/get-transactions-by-user-id'

import { BadRequest } from '../../routes/_errors/errors-instance'

export interface IGetTransactionsByUserIdController {
  execute(userId: string, from: Date | null, to: Date | null): Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdController implements IGetTransactionsByUserIdController {
  constructor(private getTransactionsByUserIdService: IGetTransactionsByUserIdService) {}

  async execute(userId: string, from: Date | null, to: Date | null) {
    if (!userId) {
      throw new BadRequest('User Id is missing or not provided!')
    }

    const defaultTo = new Date()
    const defaultFrom = new Date(dayjs(defaultTo).startOf('month').format())

    const fromDate = from ?? defaultFrom
    const toDate = to ?? defaultTo

    const transactions = await this.getTransactionsByUserIdService.execute(userId, fromDate, toDate)

    return transactions
  }
}
