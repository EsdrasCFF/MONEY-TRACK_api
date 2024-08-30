import { Account } from '@prisma/client'
import { IGetAccountsByUserIdService } from '@services/accounts/get-accounts-by-userId'

import { BadRequest } from '../../routes/_errors/errors-instance'

export interface IGetAccountsByUserIdController {
  execute(userId: string): Promise<Account[]>
}

export class GetAccountsByUserIdController implements IGetAccountsByUserIdController {
  constructor(private getAccountsByUserIdService: IGetAccountsByUserIdService) {}

  async execute(userId: string) {
    if (!userId) {
      throw new BadRequest('User Id is missing or not provided!')
    }

    const accounts = await this.getAccountsByUserIdService.execute(userId)

    return accounts
  }
}
