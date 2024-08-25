import { User } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface CreateUserProps {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface ICreateUserRepository {
  execute(createUserParams: CreateUserProps): Promise<User>
}

export class CreateUserRepository implements ICreateUserRepository {
  async execute(createUserParams: CreateUserProps) {
    const createdUser = await db.user.create({
      data: createUserParams,
    })

    return createdUser
  }
}
