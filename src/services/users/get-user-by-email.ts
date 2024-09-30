import { IGetUserByEmailRepository } from '@/repositories/users/get-user-by-email'
import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { NotFound } from '@/routes/_errors/errors-instance'

export interface UserProps {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface IGetUserByEmailService {
  execute(email: string, userId: string): Promise<UserProps>
}

export class GetUserByEmailService implements IGetUserByEmailService {
  constructor(
    private getUserByIdRepository: IGetUserByIdRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository
  ) {}

  async execute(email: string, userId: string) {
    const userExists = await this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('User not found')
    }

    const userByEmail = await this.getUserByEmailRepository.execute(email)

    if (!userByEmail) {
      throw new NotFound('User not found')
    }

    return {
      id: userByEmail.id,
      firstName: userByEmail.firstName,
      lastName: userByEmail.lastName,
      email: userByEmail.email,
    }
  }
}
