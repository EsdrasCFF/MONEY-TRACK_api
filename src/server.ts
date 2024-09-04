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
import { updateAccount } from './routes/accounts/update-account'
import { createCategory } from './routes/categories/create-category'
import { getCategories } from './routes/categories/get-categories'
import { createUser } from './routes/users/create-user'

const app = fastify()

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

app.register(createUser)

//accouts api routes
app.register(createAccount)
app.register(getAccounts)
app.register(bulkDeleteAccounts)
app.register(deleteAccount)
app.register(getAccount)
app.register(updateAccount)

//categories api routes
app.register(getCategories)
app.register(createCategory)

app.setErrorHandler(errorHandler)

const port = Number(process.env.PORT) || 3333

app
  .listen({ port })
  .then(() => {
    console.log('Server is running')
  })
  .catch((e) => {
    console.error('Failed to server start:', e)
  })
