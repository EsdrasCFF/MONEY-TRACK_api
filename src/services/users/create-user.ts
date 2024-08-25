import { User } from '@prisma/client'

import { CreateUserProps, ICreateUserRepository } from '../../repositories/users/create-user'
import { IGetUserByEmailRepository } from '../../repositories/users/get-user-by-email'
import { BadRequest } from '../../routes/_errors/erros-instance'

export interface ICreateUserService {
  execute(createUserParams: CreateUserProps): Promise<User>
}

export class CreateUserService {
  constructor(
    private createUserRepository: ICreateUserRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository
  ) {}

  async execute(createUserParams: CreateUserProps) {
    const emailIsAlreadyInUse = await this.getUserByEmailRepository.execute(createUserParams.email)

    if (emailIsAlreadyInUse) {
      throw new BadRequest('This email is Already in use!')
    }

    const createdUser = await this.createUserRepository.execute(createUserParams)

    return createdUser
  }
}
