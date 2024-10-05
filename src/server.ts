import 'dotenv/config'

import { clerkPlugin } from '@clerk/fastify'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authMiddleware } from './middlewares/auth'
import { bulkDeleteAccounts } from './routes/accounts/bulk-delete-accounts'
import { createAccount } from './routes/accounts/create-account'
import { deleteAccount } from './routes/accounts/delete-account'
import { getAccount } from './routes/accounts/get-account'
import { getAccounts } from './routes/accounts/get-accounts'
import { shareAccount } from './routes/accounts/share-account'
import { updateAccount } from './routes/accounts/update-account'
import { bulkDeleteCategories } from './routes/categories/bulk-delete-categories'
import { createCategory } from './routes/categories/create-category'
import { deleteCategory } from './routes/categories/delete-category'
import { getCategories } from './routes/categories/get-categories'
import { getCategory } from './routes/categories/get-category'
import { updateCategory } from './routes/categories/update-category'
import { getSummary } from './routes/summary/get-summary'
import { bulkDeleteTransactions } from './routes/transactions/bulk-delete-transactions'
import { createTransaction } from './routes/transactions/create-transaction'
import { deleteTransaction } from './routes/transactions/delete-transaction'
import { getTransaction } from './routes/transactions/get-transaction'
import { getTransactions } from './routes/transactions/get-transactions'
import { updateTransaction } from './routes/transactions/update-transaction'
import { getUserByEmail } from './routes/users/get-user-by-email'
import { createUser } from './routes/webhook/clerk/create-user'
import { updateUser } from './routes/webhook/clerk/update-user'

const app = fastify({ logger: true })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(clerkPlugin, {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
})

app.addHook('preHandler', authMiddleware)

//user api route
app.register(getUserByEmail)

//webhook api routes
app.register(createUser)
app.register(updateUser)

//accouts api routes
app.register(createAccount)
app.register(getAccounts)
app.register(bulkDeleteAccounts)
app.register(deleteAccount)
app.register(getAccount)
app.register(updateAccount)
app.register(shareAccount)

//categories api routes
app.register(getCategories)
app.register(createCategory)
app.register(bulkDeleteCategories)
app.register(deleteCategory)
app.register(updateCategory)
app.register(getCategory)

//transaction api routes
app.register(createTransaction)
app.register(getTransactions)
app.register(deleteTransaction)
app.register(bulkDeleteTransactions)
app.register(updateTransaction)
app.register(getTransaction)

//summary api route
app.register(getSummary)

app.setErrorHandler(errorHandler)

const PORT = Number(process.env.PORT) || 3333

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`Server is running on port: ${PORT}`)
  })
  .catch((e) => {
    console.error('Failed to server start:', e)
  })
