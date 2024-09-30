import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetUserByEmailController } from '@/controllers/users/get-user-by-email'
import { GetUserByEmailRepository } from '@/repositories/users/get-user-by-email'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { GetUserByEmailService } from '@/services/users/get-user-by-email'

export async function getUserByEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/users/by-email',
    {
      schema: {
        querystring: z.object({
          email: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.query
      const userId = request.user?.id

      const getUserByEmailRepository = new GetUserByEmailRepository()
      const getUserByIdRepository = new GetUserByIdRepository()

      const getUserByEmailService = new GetUserByEmailService(getUserByIdRepository, getUserByEmailRepository)

      const getUserByEmailController = new GetUserByEmailController(getUserByEmailService)

      const user = await getUserByEmailController.execute(email, userId!)

      return reply.code(200).send({ data: user })
    }
  )
}
