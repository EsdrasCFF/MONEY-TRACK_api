import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.setErrorHandler(errorHandler)

app
  .listen({ port: 3333 })
  .then(() => {
    console.log('Server is running')
  })
  .catch((e) => {
    console.error('Failed to server start:', e)
  })
