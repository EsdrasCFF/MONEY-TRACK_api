import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetCategoriesByUserIdController } from '@/controllers/categories/get-categories-by-user-id'
import { GetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { GetCategoriesByUserIdRepository } from '@/repositories/categories/get-categories-by-user-id'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { GetCategoriesByUserIdService } from '@/services/categories/get-categories-by-user-id'

export const getCategoriesSchema = z.object({
  Authorization: z.string({ required_error: 'Unauthorized' }),
})

export async function getCategories(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/categories',
    {
      schema: {
        querystring: z.object({
          accountId: z.string().nullable().optional(),
        }),
        response: {
          200: z.object({
            data: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                userId: z.string(),
                type: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const id = request.user!.id
      const { accountId } = request.query
      const getCategoriesByUserIdRespository = new GetCategoriesByUserIdRepository()
      const getUserByIdRepository = new GetUserByIdRepository()
      const getAccountByIdRepository = new GetAccountByIdRepository()

      const getCategoriesByUserIdService = new GetCategoriesByUserIdService(
        getCategoriesByUserIdRespository,
        getUserByIdRepository,
        getAccountByIdRepository
      )

      const getCategoriesByUserIdController = new GetCategoriesByUserIdController(getCategoriesByUserIdService)

      const categories = await getCategoriesByUserIdController.execute(id, accountId)

      return reply.code(200).send({
        data: categories,
      })
    }
  )
}
