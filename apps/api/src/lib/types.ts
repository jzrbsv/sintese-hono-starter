import type { OpenAPIHono } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AppBindings = {
  Variables: {
    logger: PinoLogger
    user: AuthUser | null
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
