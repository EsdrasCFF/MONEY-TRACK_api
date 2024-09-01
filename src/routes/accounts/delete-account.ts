import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { DeleteAccountController } from '@/controllers/accounts/delete-account'
import { DeleteAccountRepository } from '@/repositories/accounts/delete-account'
import { GetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { DeleteAccountService } from '@/services/accounts/delete-account'

export async function deleteAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/api/accounts/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            data: z.object({
              id: z.string(),
              name: z.string(),
              userId: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const userId = request.user?.id

      const deleteAccountRepository = new DeleteAccountRepository()
      const getAccountByIdRepository = new GetAccountByIdRepository()

      const deleteAccountService = new DeleteAccountService(getAccountByIdRepository, deleteAccountRepository)

      const deleteAccountController = new DeleteAccountController(deleteAccountService)

      const account = await deleteAccountController.execute(userId!, id)

      return reply.code(200).send({
        data: account,
      })
    }
  )
}
