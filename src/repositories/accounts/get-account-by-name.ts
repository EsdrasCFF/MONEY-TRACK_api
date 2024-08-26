import { Account } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface GetAccountProps {
  name: string
  userId: string
}

export interface IGetAccountByNameRepository {
  execute(getAccountParams: GetAccountProps): Promise<Account | null>
}

export class GetAccountByNameRepository {
  async execute({ name, userId }: GetAccountProps) {
    const account = await db.account.findFirst({
      where: {
        name,
        userId,
      },
    })

    return account
  }
}
