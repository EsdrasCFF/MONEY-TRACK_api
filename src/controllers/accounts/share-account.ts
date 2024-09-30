import { ServerError, Unauthorized } from '@/routes/_errors/errors-instance'
import { IShareAccountService } from '@/services/accounts/share-account'

interface ShareAccountProps {
  authenticatedUserId: string | undefined
  userId: string
  accountId: string
  canEdit: boolean
  canCreate: boolean
  email: string
}

export interface IShareAccountController {
  execute(shareAccountParams: ShareAccountProps): Promise<{ sucess: true }>
}

export class ShareAccountController {
  constructor(private shareAccountService: IShareAccountService) {}

  async execute({ accountId, authenticatedUserId, canCreate, canEdit, email, userId }: ShareAccountProps) {
    if (!authenticatedUserId || userId) {
      throw new Unauthorized()
    }

    const result = await this.shareAccountService.execute({ accountId, authenticatedUserId, canCreate, canEdit, email, userId })

    if (!result) {
      throw new ServerError()
    }

    return {
      sucess: true,
    }
  }
}
