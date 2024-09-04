import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { GetCategoryByIdController } from '@/controllers/categories/get-category-by-id'
import { GetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { GetCategoryByIdService } from '@/services/categories/get-category-by-id'

export async function getCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/categories/:categoryId',
    {
      schema: {
        params: z.object({
          categoryId: z.string(),
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
      const { categoryId } = request.params

      const userId = request.user?.id

      const getCategoryByIdRepository = new GetCategoryByIdRepository()

      const getCategoryByIdService = new GetCategoryByIdService(getCategoryByIdRepository)

      const getCategoryByIdController = new GetCategoryByIdController(getCategoryByIdService)

      const category = await getCategoryByIdController.execute(categoryId, userId!)

      return reply.code(200).send({
        data: category,
      })
    }
  )
}
