import { BadRequest } from '@/routes/_errors/errors-instance'
import { IBulkDeleteAccountsService } from '@/services/accounts/bulk-delete-accounts'

export interface IBulkDeleteAccountsController {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteAccountsController implements IBulkDeleteAccountsController {
  constructor(private bulkDeleteAccountsService: IBulkDeleteAccountsService) {}

  async execute(ids: string[], userId: string) {
    if (!userId) {
      throw new BadRequest('UserId is missing or not provided!')
    }

    const result = await this.bulkDeleteAccountsService.execute(ids, userId)

    return result
  }
}
