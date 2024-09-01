import { Account } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface IGetAccountByIdRepository {
  execute(id: string): Promise<Account | null>
}

export class GetAccountByIdRepository implements IGetAccountByIdRepository {
  async execute(id: string) {
    const account = await db.account.findUnique({
      where: { id },
    })

    return account
  }
}
