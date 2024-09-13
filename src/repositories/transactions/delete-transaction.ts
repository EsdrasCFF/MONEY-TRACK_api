import { Transaction } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface IDeleteTransactionRepository {
  execute(transactionId: string): Promise<Transaction>
}

export class DeleteTransactionRepository implements IDeleteTransactionRepository {
  async execute(transactionId: string) {
    const deletedAccount = await db.transaction.delete({
      where: {
        id: transactionId,
      },
    })

    return deletedAccount
  }
}
