import type { AppBindings } from './types'
import { OpenAPIHono, z } from '@hono/zod-openapi'
import serveEmojiFavicon from '../middlewares/emoji-favicon'
import notFound from '../middlewares/not-found'
import onError from '../middlewares/on-error'
import pinoLogger from '../middlewares/pino-logger'

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>({ strict: false })

  app.notFound(notFound)
  app.onError(onError)
  app.use(pinoLogger())
  app.use(serveEmojiFavicon('🏴‍☠️'))

  return app
}
