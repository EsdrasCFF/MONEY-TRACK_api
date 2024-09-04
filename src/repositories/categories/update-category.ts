import { Category } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface UpdateCategoryParams {
  categoryId: string
  name: string
}

export interface IUpdateCategoryRepository {
  execute({ categoryId, name }: UpdateCategoryParams): Promise<Category>
}

export class UpdateCategoryRepository implements IUpdateCategoryRepository {
  async execute({ categoryId, name }: UpdateCategoryParams) {
    const updatedCategory = await db.category.update({
      data: {
        name,
      },
      where: {
        id: categoryId,
      },
    })

    return updatedCategory
  }
}
