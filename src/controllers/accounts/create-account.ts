import { Account } from '@prisma/client'

import { BadRequest } from '../../routes/_errors/errors-instance'
import { ICreateAccountService } from '../../services/accounts/create-account'

export interface ICreateAccountController {
  execute(name: string, userId: string | undefined): Promise<Account>
}

export class CreateAccountController implements ICreateAccountController {
  constructor(private createAccountService: ICreateAccountService) {}

  async execute(name: string, userId: string | undefined) {
    if (!name || !userId) {
      throw new BadRequest('Provided Params are not valid!')
    }

    const createdAccount = await this.createAccountService.execute({
      name,
      userId,
    })

    return createdAccount
  }
}
