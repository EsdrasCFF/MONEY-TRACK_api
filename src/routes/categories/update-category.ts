import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { UpdateCategoryController } from '@/controllers/categories/update-category'
import { GetCategoryByIdRepository } from '@/repositories/categories/get-category-by-id'
import { UpdateCategoryRepository } from '@/repositories/categories/update-category'
import { UpdateCategoryService } from '@/services/categories/update-category'

export async function updateCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/api/categories/:categoryId',
    {
      schema: {
        params: z.object({
          categoryId: z.string(),
        }),
        body: z.object({
          name: z.string().trim().min(3),
        }),
      },
    },
    async (request, reply) => {
      const { name } = request.body
      const userId = request.user?.id
      const { categoryId } = request.params

      const updateCategoryRepository = new UpdateCategoryRepository()
      const getCategoryByIdRepository = new GetCategoryByIdRepository()

      const updateCategoryService = new UpdateCategoryService(updateCategoryRepository, getCategoryByIdRepository)

      const updateCategoryController = new UpdateCategoryController(updateCategoryService)

      const updatedCategory = await updateCategoryController.execute({ categoryId, name, userId: userId! })

      return reply.code(200).send({
        data: updatedCategory,
      })
    }
  )
}
