import { Category } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface GetCategoryProps {
  name: string
  userId: string
}

export interface IGetCategoryByNameRepository {
  execute(getCategoryParams: GetCategoryProps): Promise<Category | null>
}

export class GetCategoryByNameRepository implements IGetCategoryByNameRepository {
  async execute({ name, userId }: GetCategoryProps) {
    const category = await db.category.findFirst({
      where: {
        name,
        userId,
      },
    })

    return category
  }
}
