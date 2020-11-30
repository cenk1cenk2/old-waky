export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type DefaultSchema = {
  __typename?: 'DefaultSchema'
  response?: Maybe<Scalars['String']>
}

export type UserWithTokenDto = {
  __typename?: 'UserWithTokenDto'
  username: Scalars['String']
  token: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  hello: DefaultSchema
}

export type QueryHelloArgs = {
  name?: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  login: UserWithTokenDto
}

export type MutationLoginArgs = {
  password: Scalars['String']
  username: Scalars['String']
}
