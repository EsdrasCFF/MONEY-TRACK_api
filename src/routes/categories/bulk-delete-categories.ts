import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BulkDeleteCategoriesController } from '@/controllers/categories/bulk-delete-categories'
import { BulkDeleteCategoriesRepository } from '@/repositories/categories/bulk-delete-categories'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { BulkDeleteCategoriesService } from '@/services/categories/bulk-delete-categories'

const bulkDeleteCategoriesSchema = z.object({
  ids: z.array(z.string()),
})

export async function bulkDeleteCategories(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/categories/bulk-delete',
    {
      schema: {
        body: bulkDeleteCategoriesSchema,
        response: {
          200: z.object({
            data: z.object({
              result: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { ids } = request.body
      const userId = request.user?.id

      const bulkDeleteCategoriesRepository = new BulkDeleteCategoriesRepository()
      const getUserByIdRepository = new GetUserByIdRepository()

      const bulkDeleteCategoriesService = new BulkDeleteCategoriesService(bulkDeleteCategoriesRepository, getUserByIdRepository)

      const bulkDeleteCategoriesController = new BulkDeleteCategoriesController(bulkDeleteCategoriesService)

      const result = await bulkDeleteCategoriesController.execute(ids, userId!)

      return reply.code(200).send({
        data: { result },
      })
    }
  )
}
