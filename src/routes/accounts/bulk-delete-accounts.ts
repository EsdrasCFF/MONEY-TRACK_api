import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BulkDeleteAccountsController } from '@/controllers/accounts/bulk-delete-accounts'
import { BulkDeleteAccountsRepository } from '@/repositories/accounts/bulk-delete-accounts'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { BulkDeleteAccountsService } from '@/services/accounts/bulk-delete-accounts'

const bulkDeleteAccountsSchema = z.object({
  ids: z.array(z.string()),
})

export async function bulkDeleteAccounts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/accounts/bulk-delete',
    {
      schema: {
        body: bulkDeleteAccountsSchema,
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

      const bulkDeleteAccountsRepository = new BulkDeleteAccountsRepository()
      const getUserByIdRepository = new GetUserByIdRepository()

      const bulkDeleteAccountsService = new BulkDeleteAccountsService(bulkDeleteAccountsRepository, getUserByIdRepository)

      const bulkDeleteAccountsController = new BulkDeleteAccountsController(bulkDeleteAccountsService)

      const result = await bulkDeleteAccountsController.execute(ids, userId!)

      return reply.code(200).send({
        data: { result },
      })
    }
  )
}
