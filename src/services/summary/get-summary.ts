import { Transaction } from '@prisma/client'
import { addDays } from 'date-fns'

import { convertFromHundredUnitsToAmount } from '@/lib/utils'
import { IGetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { IGetAccountsByUserIdRepository } from '@/repositories/accounts/get-accounts-by-userId'
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
  execute(from: Date, to: Date, accountId: string, userId: string): Promise<unknown>
}

export class GetSummaryService implements IGetSummaryService {
  constructor(
    private getUserByIdRepository: IGetUserByIdRepository,
    private getUserBalanceRepository: IGetUserBalanceRepository,
    private getTransactionsByPeriodRepository: IGetTransactionsByPeriodRepository,
    private getCategoryRankingRepository: IGetCategoryRankingRepository,
    private getAccountByIdRepository: IGetAccountByIdRepository,
    private getAccountsByUserIdRepository: IGetAccountsByUserIdRepository
  ) {}

  async execute(from: Date, to: Date, accountId: string, userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    const correctTo = addDays(to, 1)

    if (!userExists) {
      throw new NotFound('User not found!')
    }

    const allAccounts = accountId === 'all'

    let accountsId: string[] = []

    if (allAccounts) {
      accountsId = (await this.getAccountsByUserIdRepository.execute(userId)).map((account) => account.id)
    } else {
      accountsId.push(accountId)
      const accountExists = await this.getAccountByIdRepository.execute(accountId)
      if (!accountExists) {
        throw new NotFound('Account not found!')
      }
    }

    const balance = await this.getUserBalanceRepository.execute(userExists.id, from, correctTo, accountsId) //ok

    const transactions = await this.getTransactionsByPeriodRepository.execute(from, correctTo, userId, accountsId) //ok

    // const filteredTransactions =
    //   accountId === 'all' ? transactions : transactions.filter((transaction) => transaction.accountId == accountId)

    const categoryRanking = await this.getCategoryRankingRepository.execute(userId, from, correctTo, accountsId)

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
