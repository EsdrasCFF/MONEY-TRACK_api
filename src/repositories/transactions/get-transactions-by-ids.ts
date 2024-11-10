import { Prisma } from '@prisma/client'

import { db } from '@/lib/prisma'

type TransactionWithUserId = Prisma.TransactionGetPayload<{
  include: {
    account: {
      select: {
        ownerId: true
      }
    }
  }
}>

export interface IGetTransactionsByIdsRepository {
  execute(ids: string[], userId: string): Promise<TransactionWithUserId[]>
}

export class GetTransactionsByIdsRepository implements IGetTransactionsByIdsRepository {
  async execute(ids: string[], userId: string) {
    const transactions = await db.transaction.findMany({
      where: {
        id: {
          in: ids,
        },
        account: {
          ownerId: userId,
        },
      },
      include: {
        account: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    console.log(transactions)

    return transactions
  }
}
