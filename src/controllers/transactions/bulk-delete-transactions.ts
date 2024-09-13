import { BadRequest } from '@/routes/_errors/errors-instance'
import { IBulkDeleteTransactionsService } from '@/services/transactions/bulk-delete-transactions'

export interface IBulkDeleteTransactionsController {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteTransactionsController implements IBulkDeleteTransactionsController {
  constructor(private bulkDeleteTransactionsService: IBulkDeleteTransactionsService) {}

  async execute(ids: string[], userId: string) {
    if (!userId) {
      throw new BadRequest('UserId is missing or not provided!')
    }

    const result = await this.bulkDeleteTransactionsService.execute(ids, userId)

    return result
  }
}
