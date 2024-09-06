import { Transaction } from '@prisma/client'

import { CreateTransactionProps } from '@/repositories/transactions/create-transaction'
import { BadRequest } from '@/routes/_errors/errors-instance'
import { ICreateTransactionService } from '@/services/transactions/create-transactions'

export interface ICreateTransactionController {
  execute(createTransactionParams: CreateTransactionProps, userId: string): Promise<Transaction>
}

export class CreateTransactionController implements ICreateTransactionController {
  constructor(private createTransactionService: ICreateTransactionService) {}

  async execute(createTransactionParams: CreateTransactionProps, userId: string) {
    if (!userId) {
      throw new BadRequest('UserId not provided or is invalid')
    }

    const { categoryId, description, paymentMethod } = createTransactionParams

    const transaction = await this.createTransactionService.execute(
      {
        ...createTransactionParams,
        categoryId: categoryId ?? null,
        description: description ?? null,
        paymentMethod: paymentMethod ?? 'DEBITO_CONTA',
      },
      userId
    )

    return transaction
  }
}
