import { db } from '../../lib/prisma'

export interface BalanceParams {
  incomes: number | bigint
  expenses: number | bigint
  investments: number | bigint
  balance: number | bigint
}

export interface IGetUserBalanceRepository {
  execute(userId: string, from: string, to: string): Promise<BalanceParams>
}

export class GetUserBalanceRepository implements IGetUserBalanceRepository {
  async execute(userId: string, from: string, to: string) {
    const result = await db.$queryRaw<BalanceParams[]>`
      SELECT 
        SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS incomes,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
        SUM(amount) AS balance
      
      FROM 
        transactions
      WHERE
          user_id = ${userId}
          AND date >= ${from}
          AND date <= ${to}
    `

    const incomes = Number(result[0].incomes)
    const expenses = Number(result[0].expenses)
    const investments = Number(result[0].investments)
    const balance = Number(result[0].balance)

    return {
      incomes,
      expenses,
      investments,
      balance,
    }
  }
}
