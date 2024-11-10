import { db } from '@/lib/prisma'

export interface IUpdateBalanceRepository {
  execute(accountId: string): Promise<number>
}

export class UpdateBalanceRepository implements IUpdateBalanceRepository {
  async execute(accountId: string) {
    const aggregate = await db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        accountId,
      },
    })

    const balance = aggregate._sum.amount || 0

    await db.account.update({
      data: {
        balance: balance,
      },
      where: {
        id: accountId,
      },
    })

    console.log('balance:', balance)

    return balance
  }
}
