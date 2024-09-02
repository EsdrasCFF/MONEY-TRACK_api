import { Account } from '@prisma/client'

import { BadRequest } from '@/routes/_errors/errors-instance'
import { IGetAccountByIdService } from '@/services/accounts/get-account-by-id'

export interface IGetAccountByIdController {
  execute(accountId: string, userId: string): Promise<Account>
}

export class GetAccountByIdController implements IGetAccountByIdController {
  constructor(private getAccountByIdService: IGetAccountByIdService) {}

  async execute(accountId: string, userId: string) {
    if (!accountId) {
      throw new BadRequest('AccountId is not provided')
    }

    if (!userId) {
      throw new BadRequest('UserId is not provided')
    }

    const account = await this.getAccountByIdService.execute(accountId, userId)

    return account
  }
}
