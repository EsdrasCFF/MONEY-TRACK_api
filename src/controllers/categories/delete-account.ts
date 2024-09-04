import { Category } from '@prisma/client'

import { BadRequest } from '@/routes/_errors/errors-instance'
import { IDeleteCategoryService } from '@/services/categories/delete-category'

export interface IDeleteCategoryController {
  execute(categoryId: string, userId: string): Promise<Category>
}

export class DeleteCategoryController implements IDeleteCategoryController {
  constructor(private deleteCategoryService: IDeleteCategoryService) {}

  async execute(userId: string, categoryId: string) {
    if (!userId) {
      throw new BadRequest('UserId is missing or not provided')
    }

    if (!categoryId) {
      throw new BadRequest('CategoryId is missing or not provided')
    }

    const category = await this.deleteCategoryService.execute(categoryId, userId)

    return category
  }
}
