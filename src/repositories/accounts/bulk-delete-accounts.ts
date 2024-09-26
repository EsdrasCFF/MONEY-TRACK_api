import { db } from '@/lib/prisma'

export interface IBulkDeleteAccountsRepository {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteAccountsRepository implements IBulkDeleteAccountsRepository {
  async execute(ids: string[], userId: string) {
    const result = await db.account.deleteMany({
      where: {
        id: {
          in: ids,
        },
        ownerId: userId,
      },
    })

    return result.count
  }
}
