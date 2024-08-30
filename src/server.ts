import 'dotenv/config'

import { clerkPlugin } from '@clerk/fastify'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authMiddleware } from './middlewares/auth'
import { createAccount } from './routes/accounts/create-account'
import { getAccounts } from './routes/accounts/get-accounts'
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

app.register(createAccount)
app.register(getAccounts)

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
