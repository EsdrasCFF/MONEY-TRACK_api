import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetTransactionsByUserIdController } from '@/controllers/transactions/get-transactions-by-user-id'
import { GetTransactionsByUserIdRepository } from '@/repositories/transactions/get-transactions-by-user-id'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { GetTransactionsByUserIdService } from '@/services/transactions/get-transactions-by-user-id'

// export const getAccountsSchema = z.object({
//   Authorization: z.string({ required_error: 'Unauthorized' }),
// })

export async function getTransactions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/transactions',
    {
      schema: {
        querystring: z.object({
          from: z.coerce.date().nullable().optional(),
          to: z.coerce.date().nullable().optional(),
        }),
        response: {
          200: z.object({
            data: z.array(
              z.object({
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
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.id
      const { from, to } = request.query

      const getTransactionsByUserIdRespository = new GetTransactionsByUserIdRepository()

      const getUserByIdRepository = new GetUserByIdRepository()

      const getTransactionsByUserIdService = new GetTransactionsByUserIdService(getTransactionsByUserIdRespository, getUserByIdRepository)

      const getTransactionsByUserIdController = new GetTransactionsByUserIdController(getTransactionsByUserIdService)

      const transactions = await getTransactionsByUserIdController.execute(userId, from ?? null, to ?? null)

      return reply.code(200).send({
        data: transactions,
      })
    }
  )
}
