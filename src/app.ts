import { OpenAPIHono, z } from '@hono/zod-openapi'

import notFound from './middlewares/not-found'
import onError from './middlewares/on-error'
import pinoLogger from './middlewares/pino-logger'

const app = new OpenAPIHono()

app.notFound(notFound)
app.onError(onError)
app.use(pinoLogger())

app.openapi({
  path: '/',
  method: 'get',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),

          }),
        },
      },
      description: 'Root route',
    },
  },
}, (c) => {
  return c.json({ message: '🐲 root route works' }, 200)
})

app.openapi({
  path: '/error',
  method: 'get',
  responses: {
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),

          }),
        },
      },
      description: 'Error test route',
    },
  },
}, (c) => {
  return c.json({ message: '☠️ an error ocurred' }, 500)
})

export default app
