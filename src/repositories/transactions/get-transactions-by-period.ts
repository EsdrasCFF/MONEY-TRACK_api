import { Prisma } from '@prisma/client'

import { db } from '@/lib/prisma'

type TransactionsWithDetails = Prisma.TransactionGetPayload<{
  include: {
    account: true
    category: true
  }
}>

export interface IGetTransactionsByPeriodRepository {
  execute(from: Date, to: Date, userId: string, accountsId: string[]): Promise<TransactionsWithDetails[]>
}

export class GetTransactionByPeriodRepository implements IGetTransactionsByPeriodRepository {
  async execute(from: Date, to: Date, userId: string, accountsId: string[]) {
    const transactions = await db.transaction.findMany({
      include: {
        account: true,
        category: true,
      },
      where: {
        date: {
          gte: from,
          lt: to,
        },
        accountId: {
          in: accountsId,
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    return transactions
  }
}
