import { Prisma } from '@prisma/client'

import { db } from '@/lib/prisma'

export interface CategoryRankingProps {
  name: string
  total: bigint | number
}

export interface IGetCategoryRankingRepository {
  execute(userId: string, from: Date, to: Date, accountId: string): Promise<CategoryRankingProps[]>
}

export class GetCategoryRankingRepository implements IGetCategoryRankingRepository {
  async execute(userId: string, from: Date, to: Date, accountId: string) {
    const accountCondition = accountId !== 'all' ? Prisma.sql`AND accounts.id = ${accountId}` : Prisma.empty

    const result = await db.$queryRaw(Prisma.sql`
      SELECT
        categories.name,
        SUM(transactions.amount) as total
      FROM
        transactions
      INNER JOIN
        categories ON categories.id = transactions.category_id
      INNER JOIN
        accounts ON accounts.id = transactions.account_id
      WHERE 
        transactions.type = 'EXPENSE'
        AND transactions.date >= ${from}
        AND transactions.date <= ${to}
        AND accounts.user_id = ${userId}
        ${accountCondition}

      GROUP BY
        categories.name
      
      ORDER BY total ASC
    `)

    return result as CategoryRankingProps[]
  }
}
