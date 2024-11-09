import { Transaction } from '@prisma/client'

import { IDeleteTransactionRepository } from '@/repositories/transactions/delete-transaction'
import { IGetTransactionByIdRepository } from '@/repositories/transactions/get-transaction-by-id'
import { BadRequest, NotFound } from '@/routes/_errors/errors-instance'

export interface IDeleteTransactionService {
  execute(transactionId: string, userId: string): Promise<Transaction>
}

export class DeleteTransactionService implements IDeleteTransactionService {
  constructor(
    private getTransactionByIdRepository: IGetTransactionByIdRepository,
    private deleteTransactionRepository: IDeleteTransactionRepository
  ) {}

  async execute(transactionId: string, userId: string) {
    const transactionExists = await this.getTransactionByIdRepository.execute(transactionId)

    if (!transactionExists) {
      throw new NotFound('Transaction not found')
    }

    if (userId != transactionExists.account.ownerId) {
      throw new BadRequest('UserId provided is not valid!')
    }

    const deletedTransaction = await this.deleteTransactionRepository.execute(transactionId)

    if (!deletedTransaction) {
      throw new BadRequest('Failed to delete transaction')
    }

    return deletedTransaction
  }
}
