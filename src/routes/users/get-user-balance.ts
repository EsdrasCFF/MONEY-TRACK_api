import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetUserBalanceController } from '@/controllers/users/get-user-balance'
import { GetUserBalanceRepository } from '@/repositories/users/get-user-balance'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { GetUserBalanceService } from '@/services/users/get-user-balance'

export async function getUserBalance(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/users/:userId/balance',
    {
      schema: {
        params: z.object({
          userId: z.string(),
        }),
        querystring: z.object({
          from: z.coerce.date(),
          to: z.coerce.date(),
        }),
        response: {
          200: z.object({
            data: z.object({
              incomes: z.number(),
              expenses: z.number(),
              investments: z.number(),
              balance: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userIdIsInToken = request.user?.id
      const { userId } = request.params

      const { from, to } = request.query

      const getUserBalanceRepository = new GetUserBalanceRepository()
      const getUserByIdRepository = new GetUserByIdRepository()

      const getUserBalanceService = new GetUserBalanceService(getUserBalanceRepository, getUserByIdRepository)

      const getUserBalanceController = new GetUserBalanceController(getUserBalanceService)

      const balance = await getUserBalanceController.execute(userId, userIdIsInToken!, from, to)

      return reply.code(200).send({
        data: balance,
      })
    }
  )
}
