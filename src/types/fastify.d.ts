/* eslint-disable @typescript-eslint/no-unused-vars */

// types/request.d.ts

import { FastifyRequest } from 'fastify'

// Definindo tipos customizados para FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
    }
  }
}
