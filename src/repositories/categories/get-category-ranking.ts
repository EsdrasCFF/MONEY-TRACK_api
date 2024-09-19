import { db } from '@/lib/prisma'

export interface CategoryRankingProps {
  name: string
  total: bigint | number
}

export interface IGetCategoryRankingRepository {
  execute(userId: string, from: Date, to: Date): Promise<CategoryRankingProps[]>
}

export class GetCategoryRankingRepository implements IGetCategoryRankingRepository {
  async execute(userId: string, from: Date, to: Date) {
    const result = await db.$queryRaw`
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
        transactions.amount < 0
        AND transactions.date >= ${from}
        AND transactions.date <= ${to}
        AND accounts.user_id = ${userId}

      GROUP BY
        categories.name
      
      ORDER BY total ASC
    `

    return result as CategoryRankingProps[]
  }
}
