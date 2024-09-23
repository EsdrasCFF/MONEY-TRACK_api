import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { CreateUserController } from '@/controllers/users/create-user'
import { CreateUserRepository } from '@/repositories/users/create-user'
import { GetUserByEmailRepository } from '@/repositories/users/get-user-by-email'
import { CreateUserService } from '@/services/users/create-user'

export interface WebHookData {
  data: {
    id: string
    first_name: string
    last_name: string
    email_addresses: [
      {
        email_address: string
      },
    ]
  }
  object: string
  type: string
}

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/webhook/users',
    {
      schema: {
        response: {
          201: z.object({
            data: z.object({
              id: z.string(),
              firstName: z.string(),
              lastName: z.string(),
              email: z.string(),
              document: z.string().optional().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const json = request.body

      const createUserRepository = new CreateUserRepository()
      const getUserByEmailRepository = new GetUserByEmailRepository()

      const createUserService = new CreateUserService(createUserRepository, getUserByEmailRepository)

      const createUserController = new CreateUserController(createUserService)
      const user = await createUserController.execute(json as WebHookData, request)

      return reply.code(201).send({
        data: user,
      })
    }
  )
}
