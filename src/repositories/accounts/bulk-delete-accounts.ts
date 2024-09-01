import { db } from '@/lib/prisma'

export interface IBulkDeleteAccountsRepository {
  execute(ids: string[]): Promise<number>
}

export class BulkDeleteAccountsRepository implements IBulkDeleteAccountsRepository {
  async execute(ids: string[]) {
    const result = await db.account.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return result.count
  }
}
