import { Category } from '@prisma/client'

import { IGetCategoriesByUserIdService } from '@/services/categories/get-categories-by-user-id'

import { BadRequest } from '../../routes/_errors/errors-instance'

export interface IGetCategoriesByUserIdController {
  execute(userId: string): Promise<Category[]>
}

export class GetCategoriesByUserIdController implements IGetCategoriesByUserIdController {
  constructor(private getCategoriesByUserIdService: IGetCategoriesByUserIdService) {}

  async execute(userId: string) {
    if (!userId) {
      throw new BadRequest('User Id is missing or not provided!')
    }

    const categories = await this.getCategoriesByUserIdService.execute(userId)

    return categories
  }
}
