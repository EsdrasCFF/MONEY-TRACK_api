import { User } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface IGetUserByIdRepository {
  execute(id: string): Promise<User | null>
}

export class GetUserByIdRepository implements IGetUserByIdRepository {
  async execute(id: string) {
    const user = await db.user.findUnique({
      where: { id },
    })

    return user
  }
}
