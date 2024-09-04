import { BadRequest } from '@/routes/_errors/errors-instance'
import { IBulkDeleteCategoriesService } from '@/services/categories/bulk-delete-categories'

export interface IBulkDeleteCategoriesController {
  execute(ids: string[], userId: string): Promise<number>
}

export class BulkDeleteCategoriesController implements IBulkDeleteCategoriesController {
  constructor(private bulkDeleteCategoriesService: IBulkDeleteCategoriesService) {}

  async execute(ids: string[], userId: string) {
    if (!userId) {
      throw new BadRequest('UserId is missing or not provided!')
    }

    const result = await this.bulkDeleteCategoriesService.execute(ids, userId)

    return result
  }
}
