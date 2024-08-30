import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequest, NotFound, ServerError, Unauthorized } from './routes/_errors/errors-instance'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, response) => {
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: error.errors[0].message,
    })
  }

  if (error instanceof BadRequest) {
    return response.code(400).send({
      error: { code: error.message },
    })
  }

  if (error instanceof Unauthorized) {
    return response.code(401).send({
      error: {
        code: 'Unauthenticated',
      },
    })
  }

  if (error instanceof ServerError) {
    return response.code(500).send({
      error: { code: 'INTERNAL_SERVER_ERROR' },
    })
  }

  if (error instanceof NotFound) {
    return response.code(404).send({
      error: { code: error.message },
    })
  }

  console.log('Error:', error)

  return response.status(500).send({ message: 'Internal Server Error' })
}
