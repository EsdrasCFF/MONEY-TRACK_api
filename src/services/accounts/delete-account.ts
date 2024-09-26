import { Account } from '@prisma/client'

import { IDeleteAccountRepository } from '@/repositories/accounts/delete-account'
import { IGetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { BadRequest, NotFound } from '@/routes/_errors/errors-instance'

export interface IDeleteAccountService {
  execute(accountId: string, userId: string): Promise<Account>
}

export class DeleteAccountService implements IDeleteAccountService {
  constructor(
    private getAccountByIdRepository: IGetAccountByIdRepository,
    private deleteAccountRepository: IDeleteAccountRepository
  ) {}

  async execute(accountId: string, userId: string) {
    const accountExists = await this.getAccountByIdRepository.execute(accountId)

    if (!accountExists) {
      throw new NotFound('Account not found')
    }

    if (userId != accountExists.ownerId) {
      throw new BadRequest('UserId provided is not valid!')
    }

    const deletedAccount = await this.deleteAccountRepository.execute(accountId)

    if (!deletedAccount) {
      throw new BadRequest('Failed to delete account')
    }

    return deletedAccount
  }
}
