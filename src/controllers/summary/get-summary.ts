import { IGetSummaryService } from '@/services/summary/get-summary'

export class GetSummaryController {
  constructor(private getSummaryService: IGetSummaryService) {}

  async execute(from: Date, to: Date, userId: string) {
    const result = await this.getSummaryService.execute(from, to, userId)

    return result
  }
}
