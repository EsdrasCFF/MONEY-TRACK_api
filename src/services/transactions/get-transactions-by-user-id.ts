import { addDays } from 'date-fns'

import { convertFromHundredUnitsToAmount } from '@/lib/utils'
import { IGetAccountsByUserIdRepository } from '@/repositories/accounts/get-accounts-by-userId'
import { IGetTransactionsByUserIdRepository, TransactionWithCategory } from '@/repositories/transactions/get-transactions-by-user-id'

import { IGetUserByIdRepository } from '../../repositories/users/get-user-by-id'
import { NotFound } from '../../routes/_errors/errors-instance'

export interface IGetTransactionsByUserIdService {
  execute(userId: string, from: Date, to: Date, accountId: string): Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdService implements IGetTransactionsByUserIdService {
  constructor(
    private getTransactionsByUserIdRepository: IGetTransactionsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
    private getAccountsByUserIdRepository: IGetAccountsByUserIdRepository
  ) {}

  async execute(userId: string, from: Date, to: Date, accountId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('USER_NOT_FOUND!')
    }

    const allAccounts = accountId === 'all'

    let accountsId: string[] = []

    if (allAccounts) {
      accountsId = (await this.getAccountsByUserIdRepository.execute(userId)).map((account) => account.id)
    } else {
      accountsId.push(accountId)
    }

    const correctTo = addDays(to, 1)

    const transactions = await this.getTransactionsByUserIdRepository.execute(userId, from, correctTo, accountsId)

    const converTransactionsToAmount = transactions.map((transaction) => ({
      ...transaction,
      amount: convertFromHundredUnitsToAmount(transaction.amount),
    }))

    return converTransactionsToAmount
  }
}
