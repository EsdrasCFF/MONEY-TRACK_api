import { Transaction } from '@prisma/client'

import { BadRequest } from '@/routes/_errors/errors-instance'
import { IDeleteTransactionService } from '@/services/transactions/delete-transaction'

export interface IDeleteTransactionController {
  execute(transactionId: string, userId: string): Promise<Transaction>
}

export class DeleteTransactionController implements IDeleteTransactionController {
  constructor(private deleteTransactionService: IDeleteTransactionService) {}

  async execute(userId: string, transactionId: string) {
    if (!userId) {
      throw new BadRequest('UserId is missing or not provided')
    }

    if (!transactionId) {
      throw new BadRequest('TransactionId is missing or not provided')
    }

    const transaction = await this.deleteTransactionService.execute(transactionId, userId)

    return transaction
  }
}
