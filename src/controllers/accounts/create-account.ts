import { Account } from '@prisma/client'

import { CreateAccountProps } from '../../repositories/accounts/create-account'
import { BadRequest, Unauthorized } from '../../routes/_errors/errors-instance'
import { ICreateAccountService } from '../../services/accounts/create-account'

export interface ICreateAccountController {
  execute(createAccountParams: CreateAccountProps, authenticatedUserId: string | undefined): Promise<Account>
}

export class CreateAccountController implements ICreateAccountController {
  constructor(private createAccountService: ICreateAccountService) {}

  async execute({ name, userId }: CreateAccountProps, authenticatedUserId: string | undefined) {
    if (!authenticatedUserId) {
      throw new Unauthorized('Unauthenticated!')
    }

    if (!name || !userId) {
      throw new BadRequest('Provided Params are not valid!')
    }

    if (userId != authenticatedUserId) {
      throw new BadRequest('Provided userId is not valid!')
    }

    const createdAccount = await this.createAccountService.execute({
      name,
      userId,
    })

    return createdAccount
  }
}
