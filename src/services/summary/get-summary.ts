// export interface IGetSummaryService {
//   execute(from: Date, to: Date, userId: string): Promise<>
// }

import { Transaction } from '@prisma/client'

import { convertFromHundredUnitsToAmount } from '@/lib/utils'
import { CategoryRankingProps, IGetCategoryRankingRepository } from '@/repositories/categories/get-category-ranking'
import { IGetTransactionsByPeriodRepository } from '@/repositories/transactions/get-transactions-by-period'
import { BalanceParams, IGetUserBalanceRepository } from '@/repositories/users/get-user-balance'
import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { NotFound } from '@/routes/_errors/errors-instance'

interface TransactionProps extends Transaction {
  category: string | null
  account: string | null
}

export interface SummaryProps {
  balance: BalanceParams
  transactions: TransactionProps
  categoryRanking: CategoryRankingProps[]
  transactionsTypeTotal: {
    INCOME: number
    EXPENSE: number
    INVESTMENT: number
  }
}

export interface IGetSummaryService {
  execute(from: Date, to: Date, userId: string): Promise<unknown>
}

export class GetSummaryService implements IGetSummaryService {
  constructor(
    private getUserByIdRepository: IGetUserByIdRepository,
    private getUserBalanceRepository: IGetUserBalanceRepository,
    private getTransactionsByPeriodRepository: IGetTransactionsByPeriodRepository,
    private getCategoryRankingRepository: IGetCategoryRankingRepository
  ) {}

  async execute(from: Date, to: Date, userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('User not found!')
    }
    const balance = await this.getUserBalanceRepository.execute(userExists.id, from, to) //ok

    const transactions = await this.getTransactionsByPeriodRepository.execute(from, to, userId) //ok

    const categoryRanking = await this.getCategoryRankingRepository.execute(userId, from, to) //ok

    const formattedBalance = {
      INCOMES: convertFromHundredUnitsToAmount(balance.incomes),
      EXPENSES: convertFromHundredUnitsToAmount(balance.expenses),
      INVESTMENTS: convertFromHundredUnitsToAmount(balance.investments),
      BALANCE: convertFromHundredUnitsToAmount(balance.balance),
    }

    let sizeCategories = categoryRanking.length

    const topCategories = categoryRanking.slice(0, 7).map((category) => ({
      ...category,
      total: convertFromHundredUnitsToAmount(Number(category.total)) * -1,
    }))

    const othersCategories = categoryRanking.slice(7)

    const othersCategoryTotal = sizeCategories > 7 ? othersCategories.reduce((sum, category) => sum + Number(category.total), 0) : false

    const ranking = othersCategoryTotal
      ? [
          ...topCategories,
          {
            name: 'Outras',
            total: convertFromHundredUnitsToAmount(othersCategoryTotal) * -1,
          },
        ]
      : topCategories

    const transactionTypeTotal = transactions.reduce(
      (acc, transaction) => {
        acc[transaction.type] += transaction.amount

        return acc
      },
      { INCOME: 0, EXPENSE: 0, INVESTMENT: 0 }
    ) //ok

    const formattedTransactions = transactions
      .map((transaction) => {
        return {
          ...transaction,
          category: transaction.category?.name,
          account: transaction.account.name,
          amount: convertFromHundredUnitsToAmount(transaction.amount),
        }
      })
      .slice(0, 10)

    return {
      balance: formattedBalance,
      transactions: formattedTransactions,
      categoryRanking: ranking,
      transactionsTypeTotal: {
        INCOME: convertFromHundredUnitsToAmount(transactionTypeTotal.INCOME),
        EXPENSE: convertFromHundredUnitsToAmount(transactionTypeTotal.EXPENSE * -1),
        INVESTMENT: convertFromHundredUnitsToAmount(transactionTypeTotal.INVESTMENT * -1),
      },
    }
  }
}
