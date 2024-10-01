import { Category } from '@prisma/client'

import { IGetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { IGetCategoriesByUserIdRepository } from '@/repositories/categories/get-categories-by-user-id'

import { IGetUserByIdRepository } from '../../repositories/users/get-user-by-id'
import { NotFound } from '../../routes/_errors/errors-instance'

export interface IGetCategoriesByUserIdService {
  execute(userId: string, accountId: string | undefined): Promise<Category[]>
}

export class GetCategoriesByUserIdService implements IGetCategoriesByUserIdService {
  constructor(
    private getCategoriesByUserIdRepository: IGetCategoriesByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
    private getAccountByIdRepository: IGetAccountByIdRepository
  ) {}

  async execute(userId: string, accountId: string | undefined) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('USER_NOT_FOUND!')
    }

    let validUserId = userId

    if (accountId) {
      const userByAccountId = await this.getAccountByIdRepository.execute(accountId)
      if (userByAccountId) {
        validUserId = userByAccountId.ownerId
      }
    }

    const categories = await this.getCategoriesByUserIdRepository.execute(validUserId)

    return categories
  }
}
