import { Category } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface IDeleteCategoryRepository {
  execute(categoryId: string): Promise<Category>
}

export class DeleteCategoryRepository implements IDeleteCategoryRepository {
  async execute(categoryId: string) {
    const deletedCategory = await db.category.delete({
      where: {
        id: categoryId,
      },
    })

    return deletedCategory
  }
}
