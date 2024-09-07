import { PAYMENT_METHOD } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { CreateTransactionController } from '@/controllers/transactions/create-transaction'
import { GetAccountByIdRepository } from '@/repositories/accounts/get-account-by-id'
import { CreateTransactionRepository } from '@/repositories/transactions/create-transaction'
import { GetUserByIdRepository } from '@/repositories/users/get-user-by-id'
import { CreateTransactionService } from '@/services/transactions/create-transactions'

const TransactionTypeEnum = z
  .enum(['CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'DINHEIRO', 'TRANSFERENCIA', 'BOLETO', 'DEBITO_CONTA'])
  .nullable()
  .optional()

const createTransactionSchema = z.object({
  accountId: z.string({ required_error: 'AccountId is required!' }).cuid({ message: 'Provided accountId is invalid!' }),
  paymentMethod: TransactionTypeEnum,
  categoryId: z.string().cuid({ message: 'Provided categoryId is invalid' }).nullable().optional(),
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

export async function createTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/transactions',
    {
      schema: {
        body: createTransactionSchema,
        response: {
          201: z.object({
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
      const createTransactionParams = request.body
      const userId = request.user?.id

      const createTransactionRepository = new CreateTransactionRepository()
      const getUserByIdRepository = new GetUserByIdRepository()
      const getAccountByIdRepository = new GetAccountByIdRepository()

      const createTransactionService = new CreateTransactionService(
        createTransactionRepository,
        getUserByIdRepository,
        getAccountByIdRepository
      )

      const createTransactionController = new CreateTransactionController(createTransactionService)

      const transactionParams = {
        accountId: createTransactionParams.accountId,
        categoryId: createTransactionParams.categoryId ?? null,
        paymentMethod: (createTransactionParams.paymentMethod as PAYMENT_METHOD) || null,
        payee: createTransactionParams.payee,
        date: createTransactionParams.date,
        description: createTransactionParams.description ?? null,
        amount: createTransactionParams.amount,
        type: createTransactionParams.type,
      }

      const createdTransaction = await createTransactionController.execute(transactionParams, userId!)

      return reply.code(201).send({
        data: createdTransaction,
      })
    }
  )
}
