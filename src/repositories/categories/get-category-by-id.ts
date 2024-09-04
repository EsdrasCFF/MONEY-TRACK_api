import { Category } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface IGetCategoryByIdRepository {
  execute(id: string): Promise<Category | null>
}

export class GetCategoryByIdRepository implements IGetCategoryByIdRepository {
  async execute(id: string) {
    const category = await db.category.findUnique({
      where: { id },
    })

    return category
  }
}
