import { Category } from '@prisma/client'

import { IDeleteCategoryRepository } from '@/repositories/categories/delete-category'
import { IGetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { BadRequest, NotFound } from '@/routes/_errors/errors-instance'

export interface IDeleteCategoryService {
  execute(categoryId: string, userId: string): Promise<Category>
}

export class DeleteCategoryService implements IDeleteCategoryService {
  constructor(
    private getCategoryByIdRepository: IGetCategoryByIdRepository,
    private deleteCategoryRepository: IDeleteCategoryRepository
  ) {}

  async execute(categoryId: string, userId: string) {
    const categoryExists = await this.getCategoryByIdRepository.execute(categoryId)

    if (!categoryExists) {
      throw new NotFound('Category not found')
    }

    if (userId != categoryExists.userId) {
      throw new BadRequest('UserId provided is not valid!')
    }

    const deletedCategory = await this.deleteCategoryRepository.execute(categoryId)

    if (!deletedCategory) {
      throw new BadRequest('Failed to delete category')
    }

    return deletedCategory
  }
}
