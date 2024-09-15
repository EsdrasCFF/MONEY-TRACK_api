import { BadRequest, Forbidden, Unauthorized } from '@/routes/_errors/errors-instance'
import { BalanceParams, IGetUserBalanceService } from '@/services/users/get-user-balance'

export interface IGetUserBalanceController {
  execute(userId: string, userIdByToken: string, from: Date, to: Date): Promise<BalanceParams>
}

export class GetUserBalanceController implements IGetUserBalanceController {
  constructor(private getUserBalanceService: IGetUserBalanceService) {}

  async execute(userId: string, userIdByToken: string, from: Date, to: Date) {
    if (!userId) {
      throw new BadRequest('UserId params is missing!')
    }

    if (!userIdByToken) {
      throw new Unauthorized('Token is missing')
    }

    if (userId != userIdByToken) {
      throw new Forbidden('You do not have permission to access this resource')
    }

    const balance = await this.getUserBalanceService.execute(userId, from, to)

    return balance
  }
}
