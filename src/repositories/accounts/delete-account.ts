import { Account } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface IDeleteAccountRepository {
  execute(accountId: string): Promise<Account>
}

export class DeleteAccountRepository implements IDeleteAccountRepository {
  async execute(accountId: string) {
    const deletedAccount = await db.account.delete({
      where: {
        id: accountId,
      },
    })

    return deletedAccount
  }
}
