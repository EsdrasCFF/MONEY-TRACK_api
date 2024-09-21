import { Transaction } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface TransactionWithCategory extends Transaction {
  category: string | null
}

export interface IGetTransactionsByUserIdRepository {
  execute: (userId: string, from: Date, to: Date) => Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdRepository implements IGetTransactionsByUserIdRepository {
  async execute(userId: string, from: Date, to: Date) {
    const transactions = await db.transaction.findMany({
      where: {
        account: {
          userId,
        },
        date: {
          lte: from,
          gte: to,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
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
