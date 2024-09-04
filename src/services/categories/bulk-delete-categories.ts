import { IBulkDeleteCategoriesRepository } from '@/repositories/categories/bulk-delete-categories'
import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { NotFound } from '@/routes/_errors/errors-instance'

export interface IBulkDeleteCategoriesService {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteCategoriesService implements IBulkDeleteCategoriesService {
  constructor(
    private bulkDeleteCategoriesRepository: IBulkDeleteCategoriesRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(ids: string[], userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('User not found')
    }

    const result = await this.bulkDeleteCategoriesRepository.execute(ids, userExists.id)

    return result
  }
}
