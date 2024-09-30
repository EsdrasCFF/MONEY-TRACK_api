// import { convertFromHundredUnitsToAmount } from '@/lib/utils'
// import { IGetUserBalanceRepository } from '@/repositories/users/get-user-balance'
// import { IGetUserByIdRepository } from '@/repositories/users/get-user-by-id'
// import { NotFound } from '@/routes/_errors/errors-instance'

// export interface BalanceParams {
//   incomes: number
//   expenses: number
//   investments: number
//   balance: number
// }

// export interface IGetUserBalanceService {
//   execute(userId: string, from: Date, to: Date): Promise<BalanceParams>
// }

// export class GetUserBalanceService implements IGetUserBalanceService {
//   constructor(
//     private getUserBalanceRepository: IGetUserBalanceRepository,
//     private getUserByIdRepository: IGetUserByIdRepository
//   ) {}

//   async execute(userId: string, from: Date, to: Date) {
//     const userExists = await this.getUserByIdRepository.execute(userId)

//     if (!userExists) {
//       throw new NotFound('User not found!')
//     }

//     const result = await this.getUserBalanceRepository.execute(userId, from, to)

//     const balance = {
//       incomes: convertFromHundredUnitsToAmount(result.incomes),
//       expenses: convertFromHundredUnitsToAmount(result.expenses),
//       investments: convertFromHundredUnitsToAmount(result.investments),
//       balance: convertFromHundredUnitsToAmount(result.balance),
//     }

//     return balance
//   }
// }
