import { Category } from '@prisma/client'

import { CreateCategoryProps } from '@/repositories/categories/create-category'
import { ICreateCategoryService } from '@/services/categories/create-category'

import { BadRequest, Unauthorized } from '../../routes/_errors/errors-instance'

export interface ICreateCategoryController {
  execute(createCategoryParams: CreateCategoryProps, authenticatedUserId: string | undefined): Promise<Category>
}

export class CreateCategoryController implements ICreateCategoryController {
  constructor(private createCategoryService: ICreateCategoryService) {}

  async execute({ name, userId, type }: CreateCategoryProps, authenticatedUserId: string | undefined) {
    if (!authenticatedUserId) {
      throw new Unauthorized('Unauthenticated!')
    }

    if (!name || !userId || !type) {
      throw new BadRequest('Provided Params are not valid!')
    }

    if (userId != authenticatedUserId) {
      throw new BadRequest('Provided userId is not valid!')
    }

    const createdCategory = await this.createCategoryService.execute({
      name,
      userId,
      type,
    })

    return createdCategory
  }
}
