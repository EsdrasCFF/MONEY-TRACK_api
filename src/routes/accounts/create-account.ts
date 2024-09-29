import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { CreateAccountController } from '../../controllers/accounts/create-account'
import { CreateAccountRepository } from '../../repositories/accounts/create-account'
import { GetAccountByNameRepository } from '../../repositories/accounts/get-account-by-name'
import { CreateAccountService } from '../../services/accounts/create-account'

const createAccountSchema = z.object({
  name: z.string({ required_error: 'Name is required!' }).trim().min(3, { message: 'Nome da conta precisa ter mais de 3 caracteres!' }),
})

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/accounts',
    {
      schema: {
        body: createAccountSchema,
        response: {
          201: z.object({
            data: z.object({
              name: z.string(),
              ownerId: z.string(),
              id: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body
      const userId = request.user?.id

      const createAccountRespository = new CreateAccountRepository()
      const getAccountByNameRepository = new GetAccountByNameRepository()

      const createAccountService = new CreateAccountService(createAccountRespository, getAccountByNameRepository)

      const createAccountController = new CreateAccountController(createAccountService)

      const account = await createAccountController.execute(name, userId)

      return reply.code(201).send({
        data: account,
      })
    }
  )
}
