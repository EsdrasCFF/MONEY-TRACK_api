import { Prisma } from '@prisma/client'

import { db } from '../../lib/prisma'

export interface BalanceParams {
  incomes: number | bigint
  expenses: number | bigint
  investments: number | bigint
  balance: number | bigint
}

export interface IGetUserBalanceRepository {
  execute(userId: string, from: Date, to: Date, accountsId: string[]): Promise<BalanceParams>
}

export class GetUserBalanceRepository implements IGetUserBalanceRepository {
  async execute(userId: string, from: Date, to: Date, accountsId: string[]) {
    // const accountsCondition = accountId ? Prisma.sql`AND t.account_id  = ${accountId}` : Prisma.empty

    // let accountQuery = accountsId.length == 1 ? Prisma.sql`t.account_id = ${accountsId[0]}` : Prisma.empty

    const accountsQuery = accountsId.reduce(
      (acc, cur, index) => {
        if (index === 0) {
          return Prisma.sql`t.account_id = ${cur}`
        }
        return Prisma.sql`${acc} OR t.account_id = ${cur}`
      },
      Prisma.sql``
    )

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
          t.date >= ${from}
          AND t.date <= ${to}
          AND (${accountsQuery})
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
