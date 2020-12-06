import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class DefaultResolver {
  @Query(() => String)
  public hello (): string {
    return `Waky API v${process.env.PACKAGE_VERSION}. Please check documentation under https://srcs.kilic.dev/waky`
  }
}
