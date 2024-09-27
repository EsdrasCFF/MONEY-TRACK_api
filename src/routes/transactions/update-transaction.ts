import { PAYMENT_METHOD } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UpdateTransactionController } from '@/controllers/transactions/update-transaction'
import { GetTransactionByIdRepository } from '@/repositories/transactions/get-transaction-by-id'
import { UpdateTransactionRepository } from '@/repositories/transactions/update-transaction'
import { UpdateTransactionService } from '@/services/transactions/update-transaction'

const TransactionTypeEnum = z
  .enum(['CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'DINHEIRO', 'TRANSFERENCIA', 'BOLETO', 'DEBITO_CONTA'])
  .nullable()
  .optional()

const updateTransactionSchema = z.object({
  accountId: z.string({ required_error: 'AccountId is required!' }).cuid({ message: 'Provided accountId is invalid!' }),
  paymentMethod: TransactionTypeEnum,
  categoryId: z.string().cuid({ message: 'Provided categoryId is invalid' }),
  payee: z.string({ required_error: 'Payee is required!' }),
  amount: z.union([
    z
      .string()
      .refine((value) => !isNaN(Number(value)), { message: 'Only numbers are accepts' })
      .transform((value) => parseFloat(Number(value).toFixed(2))),
    z.number().transform((value) => parseFloat(value.toFixed(2))),
  ]),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  date: z.coerce.date({ message: 'Provided date is not valid!' }),
  description: z.string().nullable().optional(),
})

export async function updateTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/api/transactions/:transactionId',
    {
      schema: {
        params: z.object({
          transactionId: z.string(),
        }),
        body: updateTransactionSchema,
        response: {
          201: z.object({
            data: z.object({
              id: z.string(),
              accountId: z.string(),
              paymentMethod: TransactionTypeEnum,
              categoryId: z.string().nullable(),
              payee: z.string(),
              amount: z.number(),
              type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
              date: z.date(),
              description: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const updateTransactionParams = request.body
      const userId = request.user?.id
      const { transactionId } = request.params

      console.log('Chegou na requisição!')

      const updateTransactionRepository = new UpdateTransactionRepository()
      const getTransactionByIdRepository = new GetTransactionByIdRepository()

      const updateTransactionService = new UpdateTransactionService(updateTransactionRepository, getTransactionByIdRepository)

      const updateTransactionController = new UpdateTransactionController(updateTransactionService)

      const transactionParams = {
        accountId: updateTransactionParams.accountId,
        categoryId: updateTransactionParams.categoryId,
        paymentMethod: (updateTransactionParams.paymentMethod as PAYMENT_METHOD) || null,
        payee: updateTransactionParams.payee,
        date: updateTransactionParams.date,
        description: updateTransactionParams.description ?? null,
        amount: updateTransactionParams.amount,
      }

      const updatedTransaction = await updateTransactionController.execute(transactionParams, userId!, transactionId)

      return reply.code(201).send({
        data: updatedTransaction,
      })
    }
  )
}
