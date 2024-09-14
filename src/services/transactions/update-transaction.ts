import { Transaction } from '@prisma/client'

import { IGetTransactionByIdRepository } from '@/repositories/transactions/get-transaction-by-id'
import { IUpdateTransactionRepository, UpdateTransactionProps } from '@/repositories/transactions/update-transaction'
import { Forbidden, NotFound } from '@/routes/_errors/errors-instance'

export interface IUpdateTransactionService {
  execute(updateTransactionParams: UpdateTransactionProps, userId: string, transactionId: string): Promise<Transaction>
}

export class UpdateTransactionService {
  constructor(
    private updateTransactionRepository: IUpdateTransactionRepository,
    private getTransactionByIdRepository: IGetTransactionByIdRepository
  ) {}

  async execute(updateTransactionParams: UpdateTransactionProps, userId: string, transactionId: string) {
    const transactionExists = await this.getTransactionByIdRepository.execute(transactionId)

    if (!transactionExists) {
      throw new NotFound('Transaction not found!')
    }

    if (transactionExists.account.userId != userId) {
      throw new Forbidden('You do not have permission to update this transaction!')
    }

    const updatedTransaction = await this.updateTransactionRepository.execute(updateTransactionParams, transactionId)

    return updatedTransaction
  }
}
