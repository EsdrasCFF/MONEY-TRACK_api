import { Account } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface IGetAccountsByUserIdRepository {
  execute: (userId: string) => Promise<Account[]>
}

export class GetAccountsByUserIdRepository implements IGetAccountsByUserIdRepository {
  async execute(userId: string) {
    const accounts = await db.account.findMany({
      where: { userId },
    })

    return accounts
  }
}
