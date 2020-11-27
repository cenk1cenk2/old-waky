import { FastifyRequest } from 'fastify'

export interface GraphQLContext {
  req: FastifyRequest<any>
}
