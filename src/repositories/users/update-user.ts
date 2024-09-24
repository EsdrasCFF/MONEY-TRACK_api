import { User } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface UpdateUserProps {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface IUpdateUserRepository {
  execute(otherParams: UpdateUserProps): Promise<User>
}

export class UpdateUserRepository implements IUpdateUserRepository {
  async execute({ id, ...otherParams }: UpdateUserProps) {
    const updatedUser = await db.user.update({
      data: otherParams,
      where: {
        id,
      },
    })

    return updatedUser
  }
}
