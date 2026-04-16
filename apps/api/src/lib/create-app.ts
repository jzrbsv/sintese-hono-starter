import type { AppBindings } from './types'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import env from '../env'
import serveEmojiFavicon from '../middlewares/emoji-favicon'
import notFound from '../middlewares/not-found'
import onError from '../middlewares/on-error'
import pinoLogger from '../middlewares/pino-logger'
import sessionMiddleware from '../middlewares/session'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false })
}

export default function createApp() {
  const app = createRouter()

  app.notFound(notFound)
  app.onError(onError)
  app.use(
    '*',
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
      allowHeaders: ['Content-Type'],
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  )
  app.use(pinoLogger())
  app.use(serveEmojiFavicon('🏴‍☠️'))
  app.use(sessionMiddleware)

  return app
}
