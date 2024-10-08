import { getAuth } from '@clerk/fastify'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export const authMiddleware = (request: FastifyRequest, reply: FastifyReply, done: (error?: FastifyError) => void) => {
  if (request.url.includes('/api/webhook/') && request.method == 'POST') {
    return done()
  }

  if (request.url == '/docs') {
    return done()
  }

  const { userId } = getAuth(request)

  if (!userId) {
    return reply.code(403).send({ error: { code: 'Unauthorized' } })
  }

  request.user = { id: userId }

  done()
}
