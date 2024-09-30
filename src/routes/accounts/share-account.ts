import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { ShareAccountController } from '@/controllers/accounts/share-account'
import { GetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { ShareAccountRepository } from '@/repositories/accounts/share-account'
import { GetUserByEmailRepository } from '@/repositories/users/get-user-by-email'
import { ShareAccountService } from '@/services/accounts/share-account'

const shareAccountSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  canCreate: z.boolean(),
  canEdit: z.boolean(),
})

export async function shareAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/accounts/:accountId/share',
    {
      schema: {
        body: shareAccountSchema,
        params: z.object({
          accountId: z.string(),
        }),
        response: {
          201: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const authenticatedUserId = request.user?.id
      const { accountId } = request.params

      const { userId, userEmail, canCreate, canEdit } = request.body

      const shareAccountRepository = new ShareAccountRepository()
      const getUserByEmailRepository = new GetUserByEmailRepository()
      const getAccountByIdRepository = new GetAccountByIdRepository()

      const shareAccountService = new ShareAccountService(shareAccountRepository, getAccountByIdRepository, getUserByEmailRepository)

      const shareAccountController = new ShareAccountController(shareAccountService)

      const result = await shareAccountController.execute({ accountId, authenticatedUserId, canCreate, canEdit, userId, email: userEmail })

      return reply.code(201).send({ success: result.sucess })
    }
  )
}
