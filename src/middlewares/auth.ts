/* eslint-disable no-unused-vars */

import { getAuth } from '@clerk/fastify'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export const authMiddleware = (request: FastifyRequest, reply: FastifyReply, done: (error?: FastifyError) => void) => {
  if (request.url == '/api/users' && request.method == 'POST') {
    return done()
  }

  const { userId } = getAuth(request)

  if (!userId) {
    return reply.code(403).send({ error: { code: 'Unauthorized' } })
  }

  done()
}