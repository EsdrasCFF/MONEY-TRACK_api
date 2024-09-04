import { db } from '@/lib/prisma'

export interface IBulkDeleteCategoriesRepository {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteCategoriesRepository implements IBulkDeleteCategoriesRepository {
  async execute(ids: string[], userId: string) {
    const result = await db.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId,
      },
    })

    return result.count
  }
}
