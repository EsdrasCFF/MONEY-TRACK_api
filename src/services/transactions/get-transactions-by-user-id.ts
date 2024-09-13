import { convertFromHundredUnitsToAmount } from '@/lib/utils'
import { IGetTransactionsByUserIdRepository, TransactionWithCategory } from '@/repositories/transactions/get-transactions-by-user-id'

import { IGetUserByIdRepository } from '../../repositories/users/get-user-by-id'
import { NotFound } from '../../routes/_errors/errors-instance'

export interface IGetTransactionsByUserIdService {
  execute(userId: string): Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdService implements IGetTransactionsByUserIdService {
  constructor(
    private getTransactionsByUserIdRepository: IGetTransactionsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('USER_NOT_FOUND!')
    }

    const transactions = await this.getTransactionsByUserIdRepository.execute(userId)

    const converTransactionsToAmount = transactions.map((transaction) => ({
      ...transaction,
      amount: convertFromHundredUnitsToAmount(transaction.amount),
    }))

    return converTransactionsToAmount
  }
}
