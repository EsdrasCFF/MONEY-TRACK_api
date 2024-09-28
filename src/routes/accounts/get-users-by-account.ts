import { UserAccount } from '@prisma/client'

export interface IGetUsersByAccountIdRepository {
  execute(accountId: string): Promise<UserAccount[]>
}

export class GetUsersByAccountIdRepository {}
