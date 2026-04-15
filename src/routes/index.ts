import { createRoute, z } from '@hono/zod-openapi'
import { createRouter } from '../lib/create-app'
import { OK } from '../utils/http-status-codes'

const index = createRouter().openapi(
  createRoute({
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

  }),
  (c) => {
    return c.json({ message: 'root route works' }, OK)
  },
)
export default index
