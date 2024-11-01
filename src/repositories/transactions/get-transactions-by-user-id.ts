import { Transaction } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface TransactionWithCategory extends Transaction {
  category: string | null
}

export interface IGetTransactionsByUserIdRepository {
  execute: (userId: string, from: Date, to: Date, accountsId: string[]) => Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdRepository implements IGetTransactionsByUserIdRepository {
  async execute(userId: string, from: Date, to: Date, accountsId: string[]) {
    const transactions = await db.transaction.findMany({
      where: {
        account: {
          id: {
            in: accountsId,
          },
        },
        date: {
          gte: from,
          lte: to,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    const transactionsWithCategory = transactions.map((transaction) => {
      return {
        ...transaction,
        category: transaction.category?.name ? transaction.category.name : null,
      }
    })

    return transactionsWithCategory
  }
}
