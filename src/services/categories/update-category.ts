import { Category } from '@prisma/client'

import { IGetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { IUpdateCategoryRepository } from '@/repositories/categories/update-category'
import { Forbidden, NotFound } from '@/routes/_errors/errors-instance'

export interface UpdateCategoryProps {
  userId: string
  categoryId: string
  name: string
}

export interface IUpdateCategoryService {
  execute({ categoryId, name, userId }: UpdateCategoryProps): Promise<Category>
}

export class UpdateCategoryService {
  constructor(
    private updateCategoryRepository: IUpdateCategoryRepository,
    private getCategoryByIdRepository: IGetCategoryByIdRepository
  ) {}

  async execute({ categoryId, name, userId }: UpdateCategoryProps) {
    const categoryExists = await this.getCategoryByIdRepository.execute(categoryId)

    if (!categoryExists) {
      throw new NotFound('Category not found!')
    }

    if (categoryExists.userId != userId) {
      throw new Forbidden('You do not have permission to update this category!')
    }

    const updatedCategory = await this.updateCategoryRepository.execute({ categoryId, name })

    return updatedCategory
  }
}
