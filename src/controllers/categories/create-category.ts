import { Category } from '@prisma/client'

import { CreateCategoryProps } from '@/repositories/categories/create-category'
import { ICreateCategoryService } from '@/services/categories/create-category'

import { BadRequest, Unauthorized } from '../../routes/_errors/errors-instance'

export interface ICreateCategoryController {
  execute(createCategoryParams: CreateCategoryProps): Promise<Category>
}

export class CreateCategoryController implements ICreateCategoryController {
  constructor(private createCategoryService: ICreateCategoryService) {}

  async execute({ name, userId, type }: CreateCategoryProps) {
    if (!userId) {
      throw new Unauthorized('Unauthenticated!')
    }

    if (!name || !type) {
      throw new BadRequest('Provided Params are not valid!')
    }

    const createdCategory = await this.createCategoryService.execute({
      name,
      userId,
      type,
    })

    return createdCategory
  }
}
