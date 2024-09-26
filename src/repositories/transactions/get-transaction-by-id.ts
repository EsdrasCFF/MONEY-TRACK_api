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

export interface IGetTransactionByIdRepository {
  execute(id: string): Promise<TransactionWithUserId | null>
}

export class GetTransactionByIdRepository implements IGetTransactionByIdRepository {
  async execute(id: string) {
    const transaction = await db.transaction.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    return transaction
  }
}
