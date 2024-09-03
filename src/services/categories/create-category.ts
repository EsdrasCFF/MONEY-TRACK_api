import { Category } from '@prisma/client'

import { CreateCategoryProps, ICreateCategoryRepository } from '../../repositories/categories/create-category'
import { IGetCategoryByNameRepository } from '../../repositories/categories/get-category-by-name'
import { BadRequest } from '../../routes/_errors/errors-instance'

export interface ICreateCategoryService {
  execute(createCategoryParams: CreateCategoryProps): Promise<Category>
}

export class CreateCategoryService implements ICreateCategoryService {
  constructor(
    private createCategoryRepository: ICreateCategoryRepository,
    private getCategoryByNameRepository: IGetCategoryByNameRepository
  ) {}

  async execute(createCategoryParams: CreateCategoryProps) {
    const categoryNameIsAlreadyInUse = await this.getCategoryByNameRepository.execute(createCategoryParams)

    if (categoryNameIsAlreadyInUse) {
      throw new BadRequest('Category name is already in use')
    }

    const createdCategory = await this.createCategoryRepository.execute(createCategoryParams)

    return createdCategory
  }
}
