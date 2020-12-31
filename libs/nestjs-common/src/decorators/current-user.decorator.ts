import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUserDecorator = Symbol('Current-User')

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const req = GqlExecutionContext.create(context).getContext().req ?? context.switchToHttp().getRequest()
  return req.user
})
