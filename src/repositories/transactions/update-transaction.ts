import { Transaction } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface UpdateTransactionProps {
  transactionId: string
  accountId: string
  categoryId: string
  payee: string
  amount: number
  description: string | null
  date: Date
}

export interface IUpdateTransactionRepository {
  execute({ transactionId, ...otherProps }: UpdateTransactionProps): Promise<Transaction>
}

export class UpdateTransactionRepository implements IUpdateTransactionRepository {
  async execute({ transactionId, ...otherProps }: UpdateTransactionProps) {
    const updatedAccount = await db.transaction.update({
      data: otherProps,
      where: {
        id: transactionId,
      },
    })

    return updatedAccount
  }
}
