import { Account } from '@prisma/client'

import { db } from '@/lib/prisma'

interface UpdateAccountParams {
  accountId: string
  name: string
}

export interface IUpdateAccountRepository {
  execute({ accountId, name }: UpdateAccountParams): Promise<Account>
}

export class UpdateAccountRepository implements IUpdateAccountRepository {
  async execute({ accountId, name }: UpdateAccountParams) {
    const updatedAccount = await db.account.update({
      data: {
        name,
      },
      where: {
        id: accountId,
      },
    })

    return updatedAccount
  }
}
