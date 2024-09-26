import { Account } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface IGetAccountsByUserIdRepository {
  execute: (userId: string) => Promise<Account[]>
}

export class GetAccountsByUserIdRepository implements IGetAccountsByUserIdRepository {
  async execute(userId: string) {
    const userWithAccount = await db.userAccount.findMany({
      where: { userId },
      include: {
        account: true,
      },
    })

    const accounts = userWithAccount.map((data) => data.account)

    return accounts
  }
}
