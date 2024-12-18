import { PAYMENT_METHOD, Transaction, TRANSACTION_TYPE } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface CreateTransactionProps {
  accountId: string
  paymentMethod: PAYMENT_METHOD | null
  categoryId: string | null
  payee: string
  amount: number
  type: TRANSACTION_TYPE
  date: Date
  description: string | null
  creatorId: string
}

export interface ICreateTransactionRepository {
  execute(createTransactionParams: CreateTransactionProps): Promise<Transaction>
}

export class CreateTransactionRepository implements ICreateTransactionRepository {
  async execute(createTransactionParams: CreateTransactionProps) {
    const transaction = await db.transaction.create({
      data: createTransactionParams,
    })

    await db.account.update({
      where: {
        id: createTransactionParams.accountId,
      },
      data: {
        balance: {
          increment: createTransactionParams.amount,
        },
      },
    })

    const amountNumber = Number(transaction.amount)

    return { ...transaction, amount: amountNumber }
  }
}
