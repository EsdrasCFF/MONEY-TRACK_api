import { Account } from '@prisma/client'

import { CreateAccountProps, ICreateAccountRepository } from '../../repositories/accounts/create-account'
import { IGetAccountByNameRepository } from '../../repositories/accounts/get-account-by-name'
import { BadRequest } from '../../routes/_errors/erros-instance'

export interface ICreateAccountService {
  execute(createAccountParams: CreateAccountProps): Promise<Account>
}

export class CreateAccountService implements ICreateAccountService {
  constructor(
    private createAccountRepository: ICreateAccountRepository,
    private getAccountByNameRepository: IGetAccountByNameRepository
  ) {}

  async execute(createAccountParams: CreateAccountProps) {
    const accountNameIsAlreadyInUse = await this.getAccountByNameRepository.execute(createAccountParams)

    if (accountNameIsAlreadyInUse) {
      throw new BadRequest('Account name is already in use')
    }

    const createdAccount = await this.createAccountRepository.execute(createAccountParams)

    return createdAccount
  }
}
