import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

import { PublicDecorator } from '@cenk1cenk2/nestjs-utils'
import { GraphQLContext } from '@waky/api/interfaces/graphql-context.interface'

@Injectable()
export class ApplicationAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor (private readonly reflector: Reflector) {
    super()
  }

  public getRequest (context: ExecutionContext): GraphQLContext['req'] {
    const ctx = GqlExecutionContext.create(context).getContext().req ?? context.switchToHttp().getRequest()
    return ctx
  }

  public async canActivate (context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(PublicDecorator, context.getHandler())

    if (isPublic) {
      return true
    } else {
      const guard = super.canActivate(context)

      // because of the types of this stuff
      if (guard instanceof Observable) {
        return guard.toPromise()
      } else {
        return guard
      }
    }
  }
}
