import { IBulkDeleteTransactionsRepository } from '@/repositories/transactions/bulk-delete-transactions'
import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { NotFound } from '@/routes/_errors/errors-instance'

export interface IBulkDeleteTransactionsService {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteTransactionsService implements IBulkDeleteTransactionsService {
  constructor(
    private bulkDeleteTransactionsRepository: IBulkDeleteTransactionsRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(ids: string[], userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('User not found')
    }

    const result = await this.bulkDeleteTransactionsRepository.execute(ids, userExists.id)

    return result
  }
}
