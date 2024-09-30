import { BadRequest, Unauthorized } from '@/routes/_errors/errors-instance'
import { IGetUserByEmailService, UserProps } from '@/services/users/get-user-by-email'

export interface IGetUserByEmailController {
  execute(email: string, userId: string): Promise<UserProps>
}

export class GetUserByEmailController implements IGetUserByEmailController {
  constructor(private getUserByEmailService: IGetUserByEmailService) {}

  async execute(email: string, userId: string) {
    if (!userId) {
      throw new Unauthorized('Anauthenticated')
    }
    if (!email) {
      throw new BadRequest('Missing email')
    }

    const user = await this.getUserByEmailService.execute(email, userId)

    return user
  }
}
