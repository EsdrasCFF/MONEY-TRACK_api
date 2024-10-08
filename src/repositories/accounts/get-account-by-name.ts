import { Account } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface GetAccountProps {
  name: string
  userId: string
}

export interface IGetAccountByNameRepository {
  execute(getAccountParams: GetAccountProps): Promise<Account | null>
}

export class GetAccountByNameRepository implements IGetAccountByNameRepository {
  async execute({ name, userId }: GetAccountProps) {
    const account = await db.account.findFirst({
      where: {
        name,
        ownerId: userId,
      },
    })

    return account
  }
}
