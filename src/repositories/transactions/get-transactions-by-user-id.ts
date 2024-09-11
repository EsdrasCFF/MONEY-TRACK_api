import { Transaction } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface TransactionWithCategory extends Transaction {
  category: string | null
}

export interface IGetTransactionsByUserIdRepository {
  execute: (userId: string) => Promise<TransactionWithCategory[]>
}

export class GetTransactionsByUserIdRepository implements IGetTransactionsByUserIdRepository {
  async execute(userId: string) {
    const transactions = await db.transaction.findMany({
      where: {
        account: {
          userId,
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
