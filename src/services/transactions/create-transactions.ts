import { Transaction } from '@prisma/client'

import { checkIfAmountIsValid, checkIfDateIsInFuture, convertFromAmountToHundredUnits, convertFromHundredUnitsToAmount } from '@/lib/utils'
import { IGetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { CreateTransactionProps, ICreateTransactionRepository } from '@/repositories/transactions/create-transaction'
import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { BadRequest, NotFound } from '@/routes/_errors/errors-instance'

export interface ICreateTransactionService {
  execute(createTransactionParams: CreateTransactionProps, userId: string): Promise<Transaction>
}

export class CreateTransactionService implements ICreateTransactionService {
  constructor(
    private createTransactionRepository: ICreateTransactionRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
    private getAccountByIdRepository: IGetAccountByIdRepository
  ) {}

  async execute(createTransactionParams: CreateTransactionProps, userId: string) {
    const userExists = this.getUserByIdRepository.execute(userId)

    if (!userExists) {
      throw new NotFound('User not found!')
    }

    const dateIsValid = !checkIfDateIsInFuture(createTransactionParams.date)

    if (!dateIsValid) {
      throw new BadRequest('Provided date cannot be in the future!')
    }

    const amountIsValid = checkIfAmountIsValid(String(createTransactionParams.amount))

    if (!amountIsValid) {
      throw new BadRequest('Provided amount is not valid!')
    }

    const accountExists = await this.getAccountByIdRepository.execute(createTransactionParams.accountId)

    if (!accountExists) {
      throw new BadRequest('Account not Found! Provided id is not valid')
    }

    const transactionAmount = convertFromAmountToHundredUnits(createTransactionParams.amount, createTransactionParams.type)

    const transaction = await this.createTransactionRepository.execute({ ...createTransactionParams, amount: transactionAmount })

    const convertToAmount = convertFromHundredUnitsToAmount(transaction.amount)

    return { ...transaction, amount: convertToAmount }
  }
}
