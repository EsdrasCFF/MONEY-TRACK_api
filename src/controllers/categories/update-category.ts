import { Category } from '@prisma/client'

import { BadRequest } from '@/routes/_errors/errors-instance'
import { IUpdateCategoryService, UpdateCategoryProps } from '@/services/categories/update-category'

export interface IUpdateCategoryController {
  execute({ categoryId, name, userId }: UpdateCategoryProps): Promise<Category>
}

export class UpdateCategoryController implements IUpdateCategoryController {
  constructor(private updateCategoryService: IUpdateCategoryService) {}

  async execute({ categoryId, name, userId }: UpdateCategoryProps) {
    if (!categoryId || !userId) {
      throw new BadRequest('CategoryId or UserId are missing or not provided')
    }

    const updatedCategory = await this.updateCategoryService.execute({ categoryId, name, userId })

    return updatedCategory
  }
}
