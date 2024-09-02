import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { UpdateAccountController } from '@/controllers/accounts/update-account'
import { GetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { UpdateAccountRepository } from '@/repositories/accounts/update-account'
import { UpdateAccountService } from '@/services/accounts/update-account'

export function updateAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/api/accounts/:accountId',
    {
      schema: {
        params: z.object({
          accountId: z.string(),
        }),
        body: z.object({
          name: z.string().trim().min(3),
        }),
      },
    },
    async (request, reply) => {
      const { name } = request.body
      const userId = request.user?.id
      const { accountId } = request.params

      const updateAccountRepository = new UpdateAccountRepository()
      const getAccountByIdRepository = new GetAccountByIdRepository()

      const updateAccountService = new UpdateAccountService(updateAccountRepository, getAccountByIdRepository)

      const updateAccountController = new UpdateAccountController(updateAccountService)

      const updatedAccount = await updateAccountController.execute({ accountId, name, userId: userId! })

      return reply.code(200).send({
        data: updatedAccount,
      })
    }
  )
}
