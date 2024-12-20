import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BulkDeleteTransactionsController } from '@/controllers/transactions/bulk-delete-transactions'
import { BulkDeleteTransactionsRepository } from '@/repositories/transactions/bulk-delete-transactions'
import { GetTransactionsByIdsRepository } from '@/repositories/transactions/get-transactions-by-ids'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { BulkDeleteTransactionsService } from '@/services/transactions/bulk-delete-transactions'
import { UpdateBalanceRepository } from '@/services/users/update-balance'

const bulkDeleteTransactionsSchema = z.object({
  ids: z.array(z.string()),
})

export async function bulkDeleteTransactions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/transactions/bulk-delete',
    {
      schema: {
        body: bulkDeleteTransactionsSchema,
        response: {
          200: z.object({
            data: z.object({
              result: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { ids } = request.body
      const userId = request.user?.id

      const bulkDeleteTransactionsRepository = new BulkDeleteTransactionsRepository()
      const getUserByIdRepository = new GetUserByIdRepository()
      const getTransactionsByIdsRepository = new GetTransactionsByIdsRepository()
      const updateBalanceRepository = new UpdateBalanceRepository()

      const bulkDeleteTransactionsService = new BulkDeleteTransactionsService(
        bulkDeleteTransactionsRepository,
        getUserByIdRepository,
        getTransactionsByIdsRepository,
        updateBalanceRepository
      )

      const bulkDeleteTransactionsController = new BulkDeleteTransactionsController(bulkDeleteTransactionsService)

      const result = await bulkDeleteTransactionsController.execute(ids, userId!)

      return reply.code(200).send({
        data: { result },
      })
    }
  )
}
