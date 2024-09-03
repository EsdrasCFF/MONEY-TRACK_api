import { Category, CATEGORY_TYPE } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface CreateCategoryProps {
  userId: string
  name: string
  type: CATEGORY_TYPE
}

export interface ICreateCategoryRepository {
  execute(createCategoryParams: CreateCategoryProps): Promise<Category>
}

export class CreateCategoryRepository {
  async execute({ name, userId, type }: CreateCategoryProps) {
    const createdCategory = await db.category.create({
      data: {
        userId,
        name,
        type,
      },
    })

    return createdCategory
  }
}
