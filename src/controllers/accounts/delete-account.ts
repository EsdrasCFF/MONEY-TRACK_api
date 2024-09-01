import { Account } from '@prisma/client'

import { BadRequest } from '@/routes/_errors/errors-instance'
import { IDeleteAccountService } from '@/services/accounts/delete-account'

export interface IDeleteAccountController {
  execute(accountId: string, userId: string): Promise<Account>
}

export class DeleteAccountController implements IDeleteAccountController {
  constructor(private deleteAccountService: IDeleteAccountService) {}

  async execute(userId: string, accountId: string) {
    if (!userId) {
      throw new BadRequest('UserId is missing or not provided')
    }

    if (!accountId) {
      throw new BadRequest('AccountId is missing or not provided')
    }

    const account = await this.deleteAccountService.execute(accountId, userId)

    return account
  }
}
