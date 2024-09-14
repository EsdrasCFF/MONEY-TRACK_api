import { Transaction } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface UpdateTransactionProps {
  accountId: string
  categoryId: string
  payee: string
  amount: number
  description: string | null
  date: Date
}

export interface IUpdateTransactionRepository {
  execute(updateTransactionParams: UpdateTransactionProps, transactionId: string): Promise<Transaction>
}

export class UpdateTransactionRepository implements IUpdateTransactionRepository {
  async execute(updateTransactionParams: UpdateTransactionProps, transactionId: string) {
    const updatedAccount = await db.transaction.update({
      data: updateTransactionParams,
      where: {
        id: transactionId,
      },
    })

    return updatedAccount
  }
}
