import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { DeleteTransactionController } from '@/controllers/transactions/delete-transaction'
import { DeleteTransactionRepository } from '@/repositories/transactions/delete-transaction'
import { GetTransactionByIdRepository } from '@/repositories/transactions/get-transaction-by-id'
import { DeleteTransactionService } from '@/services/transactions/delete-transaction'

const TransactionTypeEnum = z
  .enum(['CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'DINHEIRO', 'TRANSFERENCIA', 'BOLETO', 'DEBITO_CONTA'])
  .nullable()
  .optional()

export async function deleteTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/api/transaction/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            data: z.object({
              id: z.string(),
              accountId: z.string(),
              paymentMethod: TransactionTypeEnum,
              categoryId: z.string().cuid({ message: 'Provided categoryId is invalid' }).nullable(),
              payee: z.string(),
              amount: z.number(),
              type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
              date: z.date(),
              description: z.string().nullable().optional(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const userId = request.user?.id

      const deleteTransactionRepository = new DeleteTransactionRepository()
      const getTransactionByIdRepository = new GetTransactionByIdRepository()

      const deleteTransactionService = new DeleteTransactionService(getTransactionByIdRepository, deleteTransactionRepository)

      const deleteTransactionController = new DeleteTransactionController(deleteTransactionService)

      const transaction = await deleteTransactionController.execute(userId!, id)

      return reply.code(200).send({
        data: transaction,
      })
    }
  )
}
