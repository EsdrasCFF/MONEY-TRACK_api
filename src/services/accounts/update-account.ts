import { Account } from '@prisma/client'

import { IGetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { IUpdateAccountRepository } from '@/repositories/accounts/update-account'
import { Forbidden, NotFound } from '@/routes/_errors/errors-instance'

export interface UpdateAccountProps {
  userId: string
  accountId: string
  name: string
}

export interface IUpdateAccountService {
  execute({ accountId, name, userId }: UpdateAccountProps): Promise<Account>
}

export class UpdateAccountService {
  constructor(
    private updateAccountRepository: IUpdateAccountRepository,
    private getAccountByIdRepository: IGetAccountByIdRepository
  ) {}

  async execute({ accountId, name, userId }: UpdateAccountProps) {
    const accountExists = await this.getAccountByIdRepository.execute(accountId)

    if (!accountExists) {
      throw new NotFound('Account not found!')
    }

    if (accountExists.userId != userId) {
      throw new Forbidden('You do not have permission to update this account!')
    }

    const updatedAccount = await this.updateAccountRepository.execute({ accountId, name })

    return updatedAccount
  }
}
