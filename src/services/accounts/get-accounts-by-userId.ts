import { Account } from '@prisma/client'

import { IGetAccountsByUserIdRepository } from '../../repositories/accounts/get-accounts-by-userId'
import { IGetUserByIdRepository } from '../../repositories/users/get-user-by-id'
import { NotFound } from '../../routes/_errors/errors-instance'

export interface IGetAccountsByUserIdService {
  execute(userId: string): Promise<Account[]>
}

export class GetAccountsByUserIdService implements IGetAccountsByUserIdService {
  constructor(
    private getAccountsByUserIdRepository: IGetAccountsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute(userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('USER_NOT_FOUND!')
    }

    const accounts = await this.getAccountsByUserIdRepository.execute(userId)

    return accounts
  }
}
