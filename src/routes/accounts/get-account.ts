import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetAccountByIdController } from '@/controllers/accounts/get-account-by-id'
import { GetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { GetAccountByIdService } from '@/services/accounts/get-account-by-id'

export async function getAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/accounts/:accountId',
    {
      schema: {
        params: z.object({
          accountId: z.string(),
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
      const { accountId } = request.params

      const userId = request.user?.id

      const getAccountByIdRepository = new GetAccountByIdRepository()

      const getAccountByIdService = new GetAccountByIdService(getAccountByIdRepository)

      const getAccountByIdController = new GetAccountByIdController(getAccountByIdService)

      const account = await getAccountByIdController.execute(accountId, userId!)

      return reply.code(200).send({
        data: account,
      })
    }
  )
}
