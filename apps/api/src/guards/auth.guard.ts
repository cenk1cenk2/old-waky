import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { PublicDecorator } from '@waky/nestjs-common'

@Injectable()
export class ApplicationAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(PublicDecorator, context.getHandler())
    if (isPublic) {
      return true
    } else {
      const ctx = GqlExecutionContext.create(context)
      try {
        return true
      } catch (e) {
        throw new UnauthorizedException(e)
      }
    }
  }
}
