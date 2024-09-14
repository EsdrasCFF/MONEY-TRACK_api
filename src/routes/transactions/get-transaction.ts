import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetTransactionByIdController } from '@/controllers/transactions/get-transaction-by-id'
import { GetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { GetTransactionByIdRepository } from '@/repositories/transactions/get-transaction-by-id'
import { GetTransactionByIdService } from '@/services/transactions/get-transaction-by-id'

export async function getTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/transactions/:transactionId',
    {
      schema: {
        params: z.object({
          transactionId: z.string(),
        }),
        response: {
          200: z.object({
            data: z.object({
              id: z.string(),
              accountId: z.string(),
              paymentMethod: z.string().nullable(),
              categoryId: z.string().nullable(),
              payee: z.string(),
              amount: z.number(),
              type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
              date: z.date(),
              description: z.string().nullable().optional(),
              category: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { transactionId } = request.params

      const userId = request.user?.id

      const getTransactionByIdRepository = new GetTransactionByIdRepository()
      const getCategoryByIdRepository = new GetCategoryByIdRepository()

      const getTransactionByIdService = new GetTransactionByIdService(getTransactionByIdRepository, getCategoryByIdRepository)

      const getTransactionByIdController = new GetTransactionByIdController(getTransactionByIdService)

      const transaction = await getTransactionByIdController.execute(transactionId, userId!)

      return reply.code(200).send({
        data: transaction,
      })
    }
  )
}
