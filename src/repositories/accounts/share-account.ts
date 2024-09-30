import { UserAccount } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface ShareAccountProps {
  userId: string
  accountId: string
  canEdit: boolean
  canCreate: boolean
}

export interface IShareAccountRepository {
  execute(shareAccountParams: ShareAccountProps): Promise<UserAccount>
}

export class ShareAccountRepository implements IShareAccountRepository {
  async execute(shareAccountParams: ShareAccountProps) {
    const authorizedAccess = await db.userAccount.create({
      data: {
        userId: shareAccountParams.userId,
        accountId: shareAccountParams.accountId,
        canCreate: shareAccountParams.canCreate,
        canEdit: shareAccountParams.canEdit,
        role: 'USER',
      },
    })

    return authorizedAccess
  }
}
