import { BadRequest } from '@/routes/_errors/errors-instance'
import { IGetSummaryService } from '@/services/summary/get-summary'

export class GetSummaryController {
  constructor(private getSummaryService: IGetSummaryService) {}

  async execute(from: Date, to: Date, accountId: string | null | undefined, userId: string) {
    if (!from || !to || !userId) {
      throw new BadRequest('Required params ware not provided')
    }

    const result = await this.getSummaryService.execute(from, to, accountId ?? 'all', userId)

    return result
  }
}
