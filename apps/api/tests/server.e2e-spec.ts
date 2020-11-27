import { FastifyAdapter } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'

import { createServerModule } from '../src/server/server.module'

describe('ServerController (e2e)', () => {
  let app

  beforeAll(async () => {
    const ServerModule = createServerModule(true)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ServerModule]
    }).compile()

    app = moduleFixture.createNestApplication(new FastifyAdapter(), { logger: ['error'] })
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', async () => {
    expect(app).toBeDefined()
  })

  it('/ (GET)', async () => {
    const response = await app.inject({ url: '/', method: 'GET' })

    return expect(response.body).toBe('Hello World')
  })
})
