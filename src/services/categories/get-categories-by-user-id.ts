import { Category } from '@prisma/client'

import { IGetCategoriesByUserIdRepository } from '@/repositories/categories/get-categories-by-user-id'

import { IGetUserByIdRepository } from '../../repositories/users/get-user-by-id'
import { NotFound } from '../../routes/_errors/errors-instance'

export interface IGetCategoriesByUserIdService {
  execute(userId: string): Promise<Category[]>
}

export class GetCategoriesByUserIdService implements IGetCategoriesByUserIdService {
  constructor(
    private getCategoriesByUserIdRepository: IGetCategoriesByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('USER_NOT_FOUND!')
    }

    const categories = await this.getCategoriesByUserIdRepository.execute(userId)

    return categories
  }
}
