import { Account } from '@prisma/client'

import { BadRequest } from '@/routes/_errors/errors-instance'
import { IUpdateAccountService, UpdateAccountProps } from '@/services/accounts/update-account'

export interface IUpdateAccountController {
  execute({ accountId, name, userId }: UpdateAccountProps): Promise<Account>
}

export class UpdateAccountController implements IUpdateAccountController {
  constructor(private updateAccountService: IUpdateAccountService) {}

  async execute({ accountId, name, userId }: UpdateAccountProps) {
    if (!accountId || !userId) {
      throw new BadRequest('AccountId or UserId are missing or not provided')
    }

    const updatedAccount = await this.updateAccountService.execute({ accountId, name, userId })

    return updatedAccount
  }
}
