import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'
import { GraphQLErrorParser } from '@webundsoehne/nestjs-util'
import { FastifyRequest } from 'fastify'
import { GraphQLError, GraphQLFormattedError } from 'graphql'

// add RequestGenericInterface back with Fastify3
export async function graphQLContextParser({ req }: { req: FastifyRequest<any> }): Promise<GraphQLContext> {
  return { ...req }
}

export function graphQLErrorParser(exception: GraphQLError): GraphQLFormattedError<Record<string, any>> {
  // to convert this to enriched exception,
  // graphql handles all the errors internally, graphql exception filter is just for catching the rest of the http errors
  return {
    ...GraphQLErrorParser(exception)
  } as GraphQLFormattedError<Record<string, any>>
}
