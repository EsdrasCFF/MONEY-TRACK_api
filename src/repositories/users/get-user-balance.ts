import { Prisma } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface BalanceParams {
  incomes: number | bigint
  expenses: number | bigint
  investments: number | bigint
  balance: number | bigint
}

export interface IGetUserBalanceRepository {
  execute(userId: string, from: Date, to: Date, accountId: string | null): Promise<BalanceParams>
}

export class GetUserBalanceRepository implements IGetUserBalanceRepository {
  async execute(userId: string, from: Date, to: Date, accountId: string | null) {
    const accountCondition = accountId ? Prisma.sql`AND t.account_id  = ${accountId}` : Prisma.empty

    const result = await db.$queryRaw<BalanceParams[]>(Prisma.sql`
      SELECT 
        SUM(CASE WHEN t.type = 'INVESTMENT' THEN t.amount ELSE 0 END) AS investments,
        SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS incomes,
        SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS expenses,
        SUM(amount) AS balance
      
      FROM 
        transactions t
      JOIN
        accounts a ON t.account_id = a.id
      WHERE
          a.user_id = ${userId}
          AND t.date >= ${from}
          AND t.date <= ${to}
          ${accountCondition}
    `)

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
