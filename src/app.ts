import { z } from '@hono/zod-openapi'
import createApp from './lib/create-app'
import configureOpenAPI from './lib/openapi'

const app = createApp()
configureOpenAPI(app)

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
