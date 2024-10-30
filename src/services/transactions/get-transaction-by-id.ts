/* eslint-disable @typescript-eslint/no-unused-vars */

import { Transaction } from '@prisma/client'

import { convertFromHundredUnitsToAmount } from '@/lib/utils'
import { IGetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { IGetTransactionByIdRepository } from '@/repositories/transactions/get-transaction-by-id'
import { Forbidden, NotFound } from '@/routes/_errors/errors-instance'

export interface TransactionWithCategory extends Transaction {
  category: string | null
}

export interface IGetTransactionByIdService {
  execute(id: string, userId: string): Promise<TransactionWithCategory>
}

export class GetTransactionByIdService implements IGetTransactionByIdService {
  constructor(
    private getTransactionByIdRepository: IGetTransactionByIdRepository,
    private getCategoryByIdRepository: IGetCategoryByIdRepository
  ) {}

  async execute(id: string, userId: string) {
    const transaction = await this.getTransactionByIdRepository.execute(id)

    if (!transaction) {
      throw new NotFound('Category not found')
    }

    const userIdIsAuthorized = transaction.creatorId == userId

    const categoryId = transaction.categoryId

    let categoryName: string | null = null

    if (categoryId) {
      const category = await this.getCategoryByIdRepository.execute(categoryId)

      categoryName = category ? category.name : null
    }

    if (!userIdIsAuthorized) {
      throw new Forbidden()
    }

    const { account, amount, ...otherProps } = transaction

    const transactionReponse = {
      ...otherProps,
      category: categoryName,
      amount: convertFromHundredUnitsToAmount(amount),
    }

    return transactionReponse
  }
}
