import { clerkPlugin } from '@clerk/fastify'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authMiddleware } from './middlewares/auth'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.setErrorHandler(errorHandler)

app.register(clerkPlugin)

app.addHook('preHandler', authMiddleware)

const port = Number(process.env.PORT) || 3333

app
  .listen({ port })
  .then(() => {
    console.log('Server is running')
  })
  .catch((e) => {
    console.error('Failed to server start:', e)
  })
