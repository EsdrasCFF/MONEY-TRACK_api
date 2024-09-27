import { db } from '@/lib/prisma'

export interface IBulkDeleteTransactionsRepository {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteTransactionsRepository implements IBulkDeleteTransactionsRepository {
  async execute(ids: string[], userId: string) {
    const result = await db.transaction.deleteMany({
      where: {
        id: {
          in: ids,
        },
        account: {
          ownerId: userId,
        },
      },
    })

    return result.count
  }
}
