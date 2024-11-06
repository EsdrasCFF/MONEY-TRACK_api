import { PAYMENT_METHOD, TRANSACTION_TYPE } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface UpdateTransactionProps {
  accountId: string
  categoryId: string
  payee: string
  amount: number
  description: string | null
  date: Date
}

interface TransactionProps {
  id: string
  accountId: string
  paymentMethod: PAYMENT_METHOD | null
  categoryId: string | null
  creatorId: string
  payee: string
  amount: number
  type: TRANSACTION_TYPE
  date: Date
  description: string | null
  createdAt: Date
  updatedAt: Date
  category: {
    name: string
  } | null
}

export interface IUpdateTransactionRepository {
  execute(updateTransactionParams: UpdateTransactionProps, transactionId: string, increaseBalance: number): Promise<TransactionProps>
}

export class UpdateTransactionRepository implements IUpdateTransactionRepository {
  async execute(updateTransactionParams: UpdateTransactionProps, transactionId: string, increaseBalance: number) {
    const updatedTransaction = await db.transaction.update({
      data: updateTransactionParams,
      where: {
        id: transactionId,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    await db.account.update({
      where: {
        id: updatedTransaction.accountId,
      },
      data: {
        balance: {
          increment: increaseBalance,
        },
      },
    })

    return updatedTransaction
  }
}
