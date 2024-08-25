import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequest, ServerError } from './routes/_errors/erros-instance'

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

  if (error instanceof ServerError) {
    return response.code(500).send({
      error: { code: 'INTERNAL_SERVER_ERROR' },
    })
  }
  console.log(error)

  return response.status(500).send({ message: 'Internal Server Error' })
}
