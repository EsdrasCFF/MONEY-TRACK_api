import { Account } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface CreateAccountProps {
  userId: string
  name: string
}

export interface ICreateAccountRepository {
  execute(createAccountParams: CreateAccountProps): Promise<Account>
}

export class CreateAccountRepository {
  async execute({ name, userId }: CreateAccountProps) {
    const createdAccount = await db.account.create({
      data: {
        ownerId: userId,
        name,
      },
    })

    await db.userAccount.create({
      data: {
        accountId: createdAccount.id,
        userId,
        role: 'OWNER',
        canCreate: true,
        canEdit: true,
        acceptedUser: true,
      },
    })

    return createdAccount
  }
}
