import { UserAccount } from '@prisma/client'

import { IGetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { IShareAccountRepository } from '@/repositories/accounts/share-account'
import { IGetUserByEmailRepository } from '@/repositories/users/get-user-by-email'
import { Forbidden, NotFound } from '@/routes/_errors/errors-instance'

interface ShareAccountProps {
  authenticatedUserId: string
  userId: string
  email: string
  canEdit: boolean
  canCreate: boolean
  accountId: string
}

export interface IShareAccountService {
  execute(shareAccountParams: ShareAccountProps): Promise<UserAccount>
}

export class ShareAccountService {
  constructor(
    private shareAccountRepository: IShareAccountRepository,
    private getAccountByIdRepository: IGetAccountByIdRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository
  ) {}

  async execute({ authenticatedUserId, canCreate, canEdit, email, accountId }: ShareAccountProps) {
    const accountExists = await this.getAccountByIdRepository.execute(accountId)

    if (!accountExists) {
      throw new NotFound('Account not found')
    }

    if (authenticatedUserId !== accountExists.ownerId) {
      throw new Forbidden('You do not have access to authorize this user!')
    }

    const userExists = await this.getUserByEmailRepository.execute(email)

    if (!userExists) {
      throw new NotFound('User not found')
    }

    // if (userExists.id !== userId) {
    //   throw new BadRequest('provided userId is invalid')
    // }

    const accountShared = await this.shareAccountRepository.execute({ accountId, userId: userExists.id, canCreate, canEdit })

    return accountShared
  }
}
