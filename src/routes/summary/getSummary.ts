import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetSummaryController } from '@/controllers/summary/get-summary'
import { GetCategoryRankingRepository } from '@/repositories/categories/get-category-ranking'
import { GetTransactionByPeriodRepository } from '@/repositories/transactions/get-transactions-by-period'
import { GetUserBalanceRepository } from '@/repositories/users/get-user-balance'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { GetSummaryService } from '@/services/summary/get-summary'

export async function getSummary(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/summary',
    {
      schema: {
        querystring: z.object({
          to: z.coerce.date(),
          from: z.coerce.date(),
        }),
      },
    },
    async (request, reply) => {
      const { from, to } = request.query
      const userId = request.user?.id

      const getUserByIdRepository = new GetUserByIdRepository()
      const getUserBalanceRepository = new GetUserBalanceRepository()
      const getTransactionByPeriodRepository = new GetTransactionByPeriodRepository()
      const getCategoryRankingRepository = new GetCategoryRankingRepository()

      const getSummaryService = new GetSummaryService(
        getUserByIdRepository,
        getUserBalanceRepository,
        getTransactionByPeriodRepository,
        getCategoryRankingRepository
      )

      const getSummaryController = new GetSummaryController(getSummaryService)

      const result = await getSummaryController.execute(from, to, userId!)

      return reply.code(200).send({
        data: result,
      })
    }
  )
}
