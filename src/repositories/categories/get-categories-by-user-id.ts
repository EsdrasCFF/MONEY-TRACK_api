import { Category } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface IGetCategoriesByUserIdRepository {
  execute: (userId: string) => Promise<Category[]>
}

export class GetCategoriesByUserIdRepository implements IGetCategoriesByUserIdRepository {
  async execute(userId: string) {
    const categories = await db.category.findMany({
      where: { userId },
    })

    return categories
  }
}
