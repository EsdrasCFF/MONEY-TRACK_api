import { db } from '@/lib/prisma'
import { PAYMENT_METHOD, TRANSACTION_TYPE, Transaction } from '@prisma/client'

interface CreateTransactionProps {
  accountId: string
  paymentMethod: PAYMENT_METHOD | null
  categoryId: string | null
  payee: string
  amount: number
  type: TRANSACTION_TYPE
  date: Date
  description: string | null
}

export interface ICreateTransactionRepository {
  execute(createTransactionParams: CreateTransactionProps): Promise<Transaction>
}

export class CreateTransactionRepository implements ICreateTransactionRepository {
  async execute(createTransactionParams: CreateTransactionProps) {
    const transaction = await db.transaction.create({
      data: createTransactionParams,
    })

    return transaction
  }
}
