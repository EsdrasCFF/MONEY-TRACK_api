import { BadRequest } from '@/routes/_errors/errors-instance'
import { IGetTransactionByIdService, TransactionWithCategory } from '@/services/transactions/get-transaction-by-id'

export interface IGetTransactionByIdController {
  execute(transactionId: string, userId: string): Promise<TransactionWithCategory>
}

export class GetTransactionByIdController implements IGetTransactionByIdController {
  constructor(private getTransactionByIdService: IGetTransactionByIdService) {}

  async execute(transactionId: string, userId: string) {
    if (!transactionId) {
      throw new BadRequest('transactionId is not provided')
    }

    if (!userId) {
      throw new BadRequest('UserId is not provided')
    }

    const transaction = await this.getTransactionByIdService.execute(transactionId, userId)

    return transaction
  }
}
