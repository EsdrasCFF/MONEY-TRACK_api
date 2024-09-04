import { Category } from '@prisma/client'

import { IGetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { BadRequest, NotFound } from '@/routes/_errors/errors-instance'

export interface IGetCategoryByIdService {
  execute(id: string, userId: string): Promise<Category>
}

export class GetCategoryByIdService implements IGetCategoryByIdService {
  constructor(private getCategoryByIdRepository: IGetCategoryByIdRepository) {}

  async execute(id: string, userId: string) {
    const category = await this.getCategoryByIdRepository.execute(id)

    if (!category) {
      throw new NotFound('Category not found')
    }

    const userIdIsValid = category.userId == userId

    if (!userIdIsValid) {
      throw new BadRequest('Provided userId is not valid')
    }

    return category
  }
}
