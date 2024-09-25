import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetSummaryController } from '@/controllers/summary/get-summary'
import { GetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { GetCategoryRankingRepository } from '@/repositories/categories/get-category-ranking'
import { GetTransactionByPeriodRepository } from '@/repositories/transactions/get-transactions-by-period'
import { GetUserBalanceRepository } from '@/repositories/users/get-user-balance'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { GetSummaryService } from '@/services/summary/get-summary'

const categoryRanking = z.object({
  name: z.string(),
  total: z.number(),
})

export const responseSchema = z.object({
  data: z.object({
    balance: z.object({
      INCOMES: z.number(),
      EXPENSES: z.number(),
      INVESTMENTS: z.number(),
      BALANCE: z.number(),
    }),
    transactions: z.object({
      id: z.string(),
      accountId: z.string(),
      paymentMethod: z.string().nullable(),
      categoryId: z.string().nullable(),
      payee: z.string(),
      amount: z.number(),
      type: z.string(),
      date: z.date(),
      description: z.string().nullable(),
      category: z.string().nullable(),
      account: z.string().nullable(),
    }),
    categoryRanking: z.array(categoryRanking),
    transactionsTypeTotal: z.object({
      INCOME: z.number(),
      EXPENSE: z.number(),
      INVESTMENT: z.number(),
    }),
  }),
})

export async function getSummary(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/summary',
    {
      schema: {
        querystring: z.object({
          to: z.coerce.date(),
          from: z.coerce.date(),
          accountId: z.string().nullable().optional(),
        }),
        // response: {
        //   200: responseSchema,
        // },
      },
    },
    async (request, reply) => {
      const { from, to, accountId } = request.query
      const userId = request.user?.id

      const getUserByIdRepository = new GetUserByIdRepository()
      const getUserBalanceRepository = new GetUserBalanceRepository()
      const getTransactionByPeriodRepository = new GetTransactionByPeriodRepository()
      const getCategoryRankingRepository = new GetCategoryRankingRepository()
      const getAccountByIdRepository = new GetAccountByIdRepository()

      const getSummaryService = new GetSummaryService(
        getUserByIdRepository,
        getUserBalanceRepository,
        getTransactionByPeriodRepository,
        getCategoryRankingRepository,
        getAccountByIdRepository
      )

      const getSummaryController = new GetSummaryController(getSummaryService)

      const result = await getSummaryController.execute(from, to, accountId, userId!)

      console.log(result)

      return reply.code(200).send({
        data: result,
      })
    }
  )
}
