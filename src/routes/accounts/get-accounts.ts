import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetAccountsByUserIdController } from '@/controllers/accounts/get-accounts-by-userId'
import { GetAccountsByUserIdRepository } from '@/repositories/accounts/get-accounts-by-userId'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { GetAccountsByUserIdService } from '@/services/accounts/get-accounts-by-userId'

export const getAccountsSchema = z.object({
  Authorization: z.string({ required_error: 'Unauthorized' }),
})

export async function getAccounts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/accounts',
    {
      schema: {
        // headers: z.o,
        response: {
          200: z.object({
            data: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                ownerId: z.string(),
                balance: z.number(),
                initialBalance: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const id = request.user!.id

      const getAccountsByUserIdRespository = new GetAccountsByUserIdRepository()
      const getUserByIdRepository = new GetUserByIdRepository()

      const getAccountsByUserIdService = new GetAccountsByUserIdService(getAccountsByUserIdRespository, getUserByIdRepository)

      const getAccountsByUserIdController = new GetAccountsByUserIdController(getAccountsByUserIdService)

      const accounts = await getAccountsByUserIdController.execute(id)

      return reply.code(200).send({
        data: accounts,
      })
    }
  )
}
