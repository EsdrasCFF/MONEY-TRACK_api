import { Transaction } from '@prisma/client'

import { convertFromAmountToHundredUnits } from '@/lib/utils'
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

    if (transactionExists.account.ownerId != userId) {
      throw new Forbidden('You do not have permission to update this transaction!')
    }

    const transactionAmount = convertFromAmountToHundredUnits(updateTransactionParams.amount, transactionExists.type)

    const updatedTransaction = await this.updateTransactionRepository.execute(
      { ...updateTransactionParams, amount: transactionAmount },
      transactionId
    )

    return updatedTransaction
  }
}
