import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUserIdDecorator = Symbol('Current-User')

export const CurrentUserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest()
  return req.headers?.user?.id
})
