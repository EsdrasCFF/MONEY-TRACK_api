import { PAYMENT_METHOD, TRANSACTION_TYPE } from '@prisma/client'

import { convertFromAmountToHundredUnits } from '@/lib/utils'
import { IGetTransactionByIdRepository } from '@/repositories/transactions/get-transaction-by-id'
import { IUpdateTransactionRepository, UpdateTransactionProps } from '@/repositories/transactions/update-transaction'
import { Forbidden, NotFound } from '@/routes/_errors/errors-instance'

export interface TransactionProps {
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
  category: string | null
}

export interface IUpdateTransactionService {
  execute(updateTransactionParams: UpdateTransactionProps, userId: string, transactionId: string): Promise<TransactionProps>
}

export class UpdateTransactionService {
  constructor(
    private updateTransactionRepository: IUpdateTransactionRepository,
    private getTransactionByIdRepository: IGetTransactionByIdRepository
  ) {}

  async execute(updateTransactionParams: UpdateTransactionProps, userId: string, transactionId: string) {
    const transactionExists = await this.getTransactionByIdRepository.execute(transactionId)

    if (!transactionExists) {
      throw new NotFound('Transaction not found!')
    }

    if (transactionExists.creatorId != userId) {
      throw new Forbidden('You do not have permission to update this transaction!')
    }

    const transactionAmount = convertFromAmountToHundredUnits(updateTransactionParams.amount, transactionExists.type)

    const increateBalance = transactionAmount - transactionExists.amount

    const updatedTransaction = await this.updateTransactionRepository.execute(
      { ...updateTransactionParams, amount: transactionAmount },
      transactionId,
      increateBalance
    )

    const { category, ...otherProps } = updatedTransaction

    const newTransaction = {
      ...otherProps,
      category: category?.name || null,
    }

    return newTransaction
  }
}
