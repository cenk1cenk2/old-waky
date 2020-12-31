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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
}

export type UserSessionEntity = {
  __typename?: 'UserSessionEntity'
  id: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  version: Scalars['Float']
  userId: Scalars['String']
  exp: Scalars['DateTime']
  iat: Scalars['DateTime']
  ip: Scalars['String']
  location: Scalars['String']
  os: Scalars['String']
  browser: Scalars['String']
  user: UserEntity
}

export type UserEntity = {
  __typename?: 'UserEntity'
  id: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  version: Scalars['Float']
  username: Scalars['String']
  hash?: Maybe<Scalars['String']>
  password?: Maybe<Scalars['String']>
  userSessions?: Maybe<UserSessionEntity[]>
  machineSessions?: Maybe<MachineSessionEntity[]>
}

export type MachineSessionEntity = {
  __typename?: 'MachineSessionEntity'
  id: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  version: Scalars['Float']
  userId: Scalars['String']
  token: Scalars['String']
  user: UserEntity
}

export type LoginOutput = {
  __typename?: 'LoginOutput'
  token: Scalars['String']
  user: UserEntity
}

export type PaginationOutput = {
  __typename?: 'PaginationOutput'
  limit: Scalars['Int']
  page: Scalars['Int']
  total: Scalars['Int']
}

export type GetUserSessionsOutput = {
  __typename?: 'GetUserSessionsOutput'
  result: Maybe<UserSessionEntity>[]
  pagination: PaginationOutput
}

export type PaginationArgsInput = {
  limit?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
}

export type Query = {
  __typename?: 'Query'
  hello: Scalars['String']
  getUserSessions: GetUserSessionsOutput
}

export type QueryGetUserSessionsArgs = {
  pagination?: Maybe<PaginationArgsInput>
}

export type Mutation = {
  __typename?: 'Mutation'
  login: LoginOutput
}

export type MutationLoginArgs = {
  username: Scalars['String']
  password?: Maybe<Scalars['String']>
}
