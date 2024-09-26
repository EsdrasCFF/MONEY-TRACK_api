import { Account } from '@prisma/client'

import { IGetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { BadRequest, NotFound } from '@/routes/_errors/errors-instance'

export interface IGetAccountByIdService {
  execute(id: string, userId: string): Promise<Account>
}

export class GetAccountByIdService implements IGetAccountByIdService {
  constructor(private getAccountByIdRepository: IGetAccountByIdRepository) {}

  async execute(id: string, userId: string) {
    const account = await this.getAccountByIdRepository.execute(id)

    if (!account) {
      throw new NotFound('Account not found')
    }

    const userIdIsValid = account.ownerId == userId

    if (!userIdIsValid) {
      throw new BadRequest('Provided userId is not valid')
    }

    return account
  }
}
