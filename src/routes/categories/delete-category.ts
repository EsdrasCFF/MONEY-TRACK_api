import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { DeleteCategoryController } from '@/controllers/categories/delete-category'
import { DeleteCategoryRepository } from '@/repositories/categories/delete-category'
import { GetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { DeleteCategoryService } from '@/services/categories/delete-category'

export async function deleteCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/api/categories/:id',
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

      const deleteCategoryRepository = new DeleteCategoryRepository()
      const getCategoryByIdRepository = new GetCategoryByIdRepository()

      const deleteCategoryService = new DeleteCategoryService(getCategoryByIdRepository, deleteCategoryRepository)

      const deleteCategoryController = new DeleteCategoryController(deleteCategoryService)

      const category = await deleteCategoryController.execute(userId!, id)

      return reply.code(200).send({
        data: category,
      })
    }
  )
}
