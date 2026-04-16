import type { AppBindings } from './types'
import { OpenAPIHono } from '@hono/zod-openapi'
import serveEmojiFavicon from '../middlewares/emoji-favicon'
import notFound from '../middlewares/not-found'
import onError from '../middlewares/on-error'
import pinoLogger from '../middlewares/pino-logger'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false })
}

export default function createApp() {
  const app = createRouter()

  app.notFound(notFound)
  app.onError(onError)
  app.use(pinoLogger())
  app.use(serveEmojiFavicon('🏴‍☠️'))

  return app
}
