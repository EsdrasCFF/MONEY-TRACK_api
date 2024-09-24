import { User } from '@prisma/client'

import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { IUpdateUserRepository } from '@/repositories/users/update-user'

import { IGetUserByEmailRepository } from '../../repositories/users/get-user-by-email'
import { BadRequest, NotFound } from '../../routes/_errors/errors-instance'

interface UpdateUserProps {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
}

export interface IUpdateUserService {
  execute(updateUserParams: UpdateUserProps): Promise<User>
}

export class UpdateUserService {
  constructor(
    private updateUserRepository: IUpdateUserRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private getUserByIdRepository: IGetUserByIdRepository
  ) {}

  async execute({ email, firstName, id, lastName }: UpdateUserProps) {
    const hasEmail = email
    const userExists = await this.getUserByIdRepository.execute(id)

    if (!userExists) {
      throw new NotFound('User not found')
    }

    let userByEmail: User | null = null

    if (hasEmail) {
      userByEmail = await this.getUserByEmailRepository.execute(email)
    }

    if (userByEmail && userByEmail.id != userExists.id) {
      throw new BadRequest('This email is already is use!')
    }

    const dataUser = {
      id,
      firstName: firstName ?? userExists.firstName,
      lastName: lastName ?? userExists.lastName,
      email: email ?? userExists.email,
    }

    const updatedUser = await this.updateUserRepository.execute(dataUser)

    return updatedUser
  }
}
