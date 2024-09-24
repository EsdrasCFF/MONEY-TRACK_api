import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { UpdateUserController } from '@/controllers/users/update-user'
import { GetUserByEmailRepository } from '@/repositories/users/get-user-by-email'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { UpdateUserRepository } from '@/repositories/users/update-user'
import { UpdateUserService } from '@/services/users/update-user'

type EventType = 'user.created' | 'user.updated'

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
  type: EventType
}

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/webhook/clerk/update-user',
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

      const updateUserRepository = new UpdateUserRepository()
      const getUserByEmailRepository = new GetUserByEmailRepository()
      const getUserByIdRepository = new GetUserByIdRepository()

      const updateUserService = new UpdateUserService(updateUserRepository, getUserByEmailRepository, getUserByIdRepository)

      const updateUserController = new UpdateUserController(updateUserService)
      const user = await updateUserController.execute(json as WebHookData, request)

      return reply.code(201).send({
        data: user,
      })
    }
  )
}
