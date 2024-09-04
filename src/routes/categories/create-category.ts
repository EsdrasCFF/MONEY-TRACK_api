import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { CreateCategoryController } from '@/controllers/categories/create-category'
import { CreateCategoryRepository } from '@/repositories/categories/create-category'
import { GetCategoryByNameRepository } from '@/repositories/categories/get-category-by-name'
import { CreateCategoryService } from '@/services/categories/create-category'

const createCategorySchema = z.object({
  name: z.string({ required_error: 'Name is required!' }).trim().min(3, { message: 'Nome da conta precisa ter mais de 3 caracteres!' }),
  userId: z.string({ required_error: 'UserId is required!' }).trim(),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT'], { required_error: 'INCOME OR EXPENSE type is required!' }),
})

export async function createCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/categories',
    {
      schema: {
        body: createCategorySchema,
        response: {
          201: z.object({
            data: z.object({
              name: z.string(),
              userId: z.string(),
              id: z.string(),
              type: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, userId, type } = request.body
      const authenticatedUserId = request.user?.id

      const createCategoryRespository = new CreateCategoryRepository()
      const getCategoryByNameRepository = new GetCategoryByNameRepository()

      const createCategoryService = new CreateCategoryService(createCategoryRespository, getCategoryByNameRepository)

      const createCategoryController = new CreateCategoryController(createCategoryService)

      const category = await createCategoryController.execute({ name, userId, type }, authenticatedUserId)

      return reply.code(201).send({
        data: category,
      })
    }
  )
}
