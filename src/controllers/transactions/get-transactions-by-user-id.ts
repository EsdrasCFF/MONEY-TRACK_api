import { TransactionWithCategory } from '@/repositories/transactions/get-transactions-by-user-id'
import { IGetTransactionsByUserIdService } from '@/services/transactions/get-transactions-by-user-id'

import { BadRequest } from '../../routes/_errors/errors-instance'

export interface IGetTransactionsByUserIdController {
  execute(userId: string): Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdController implements IGetTransactionsByUserIdController {
  constructor(private getTransactionsByUserIdService: IGetTransactionsByUserIdService) {}

  async execute(userId: string) {
    if (!userId) {
      throw new BadRequest('User Id is missing or not provided!')
    }

    const transactions = await this.getTransactionsByUserIdService.execute(userId)

    return transactions
  }
}
