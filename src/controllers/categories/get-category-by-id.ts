import { Category } from '@prisma/client'

import { BadRequest } from '@/routes/_errors/errors-instance'
import { IGetCategoryByIdService } from '@/services/categories/get-category-by-id'

export interface IGetCategoryByIdController {
  execute(categoryId: string, userId: string): Promise<Category>
}

export class GetCategoryByIdController implements IGetCategoryByIdController {
  constructor(private getCategoryByIdService: IGetCategoryByIdService) {}

  async execute(categoryId: string, userId: string) {
    if (!categoryId) {
      throw new BadRequest('CategoryId is not provided')
    }

    if (!userId) {
      throw new BadRequest('UserId is not provided')
    }

    const category = await this.getCategoryByIdService.execute(categoryId, userId)

    return category
  }
}
