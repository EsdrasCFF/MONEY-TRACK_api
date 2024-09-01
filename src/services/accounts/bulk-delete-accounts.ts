import { IBulkDeleteAccountsRepository } from '@/repositories/accounts/bulk-delete-accounts'
import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { NotFound } from '@/routes/_errors/errors-instance'

export interface IBulkDeleteAccountsService {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteAccountsService implements IBulkDeleteAccountsService {
  constructor(
    private bulkDeleteAccountsRepository: IBulkDeleteAccountsRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(ids: string[], userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('User not found')
    }

    const result = await this.bulkDeleteAccountsRepository.execute(ids, userExists.id)

    return result
  }
}
