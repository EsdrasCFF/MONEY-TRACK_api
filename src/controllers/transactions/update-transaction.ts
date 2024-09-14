import { Transaction } from '@prisma/client'

import { UpdateTransactionProps } from '@/repositories/transactions/update-transaction'
import { BadRequest } from '@/routes/_errors/errors-instance'
import { IUpdateTransactionService } from '@/services/transactions/update-transaction'

export interface IUpdateTransactionController {
  execute(updateTransactionParams: UpdateTransactionProps, userId: string, transactionId: string): Promise<Transaction>
}

export class UpdateTransactionController implements IUpdateTransactionController {
  constructor(private updateTransactionService: IUpdateTransactionService) {}

  async execute(updateTransactionParams: UpdateTransactionProps, userId: string, transactionId: string) {
    if (!transactionId || !userId) {
      throw new BadRequest('transactionId or UserId are missing or not provided')
    }

    const updatedTransaction = await this.updateTransactionService.execute(updateTransactionParams, userId, transactionId)

    return updatedTransaction
  }
}
